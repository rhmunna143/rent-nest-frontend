import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { Property } from "@/types";

// In-memory per-IP rate limiter (10 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= 10) {
    return false;
  }

  entry.count += 1;
  return true;
}

const filterSchema = z.object({
  search: z.string().nullable().optional(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
  bedrooms: z.number().nullable().optional(),
  bathrooms: z.number().nullable().optional(),
  explanation: z.string(),
});

export async function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
  return NextResponse.json({ enabled: hasKey });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    return NextResponse.json(
      { enabled: false, error: "AI Assistant is not configured on this server." },
      { status: 503 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait a minute before sending another message." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const userMessage = typeof body.message === "string" ? body.message.trim() : "";

    if (!userMessage) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    // Call Gemini 2.0 Flash REST endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `You are RentNest AI property assistant.
The user wants to find rental properties or ask about rental options.
Analyze their query: "${userMessage}".

Extract any search parameters into a JSON object matching this schema:
{
  "search": string or null (keywords, location name like "Gulshan", "Downtown", "Austin"),
  "minPrice": number or null (minimum rent),
  "maxPrice": number or null (maximum rent),
  "bedrooms": number or null (number of bedrooms),
  "bathrooms": number or null (number of bathrooms),
  "explanation": string (A concise, helpful 1-2 sentence response summarizing what you searched for)
}

Output ONLY valid JSON. No markdown code blocks, no other text.`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json(
        { error: "AI service failed to process request", details: errText },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Clean JSON text if wrapped in ```json ... ```
    const cleanedText = rawText.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(cleanedText);
    } catch {
      parsedJson = {
        explanation: "I searched our listings based on your request.",
      };
    }

    const validatedFilters = filterSchema.safeParse(parsedJson);
    const filter = validatedFilters.success
      ? validatedFilters.data
      : { explanation: "Here are properties that match your inquiry." };

    // Now query the real /properties endpoint with validated filters
    const origin = process.env.API_ORIGIN || "http://localhost:8080";
    const queryParams = new URLSearchParams();

    if (filter.search) queryParams.set("search", filter.search);
    if (filter.minPrice !== null && filter.minPrice !== undefined) {
      queryParams.set("minPrice", String(filter.minPrice));
    }
    if (filter.maxPrice !== null && filter.maxPrice !== undefined) {
      queryParams.set("maxPrice", String(filter.maxPrice));
    }
    if (filter.bedrooms !== null && filter.bedrooms !== undefined) {
      queryParams.set("bedrooms", String(filter.bedrooms));
    }
    queryParams.set("limit", "6");

    const propertiesRes = await fetch(`${origin}/api/properties?${queryParams.toString()}`);
    let properties: Property[] = [];

    if (propertiesRes.ok) {
      const propertiesData = await propertiesRes.json();
      properties = propertiesData.data ?? [];
    }

    return NextResponse.json({
      explanation: filter.explanation,
      filters: {
        search: filter.search || null,
        minPrice: filter.minPrice ?? null,
        maxPrice: filter.maxPrice ?? null,
        bedrooms: filter.bedrooms ?? null,
      },
      properties,
      total: properties.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
