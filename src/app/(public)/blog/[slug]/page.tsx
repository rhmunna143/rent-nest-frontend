import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

import { blogPosts } from "@/lib/data/blog";
import { Button } from "@/components/ui/button";
import { BlogShareButtons } from "@/components/public/BlogShareButtons";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found | RentNest",
    };
  }

  return {
    title: `${post.title} | RentNest Guides`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 -ml-4 text-muted-foreground hover:text-foreground rounded-xl"
          asChild
        >
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all guides
          </Link>
        </Button>

        {post.coverImage && (
          <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden mb-8 bg-muted shadow-2xs">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium text-xs">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 py-6 border-y">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="font-medium text-foreground">{post.author}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Prose Content */}
        <article
          className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-16 pt-8 border-t space-y-4">
          <h3 className="text-lg font-bold">Share this guide</h3>
          <BlogShareButtons title={post.title} slug={post.slug} />
        </div>
      </div>
    </div>
  );
}
