import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blog";
import { format } from "date-fns";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all blog posts so they can be statically generated
export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/blog">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all guides
          </Link>
        </Button>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 py-6 border-y">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium">
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
          className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content as string }}
        />
        
        <div className="mt-16 pt-8 border-t">
          <h3 className="text-xl font-bold mb-4">Share this guide</h3>
          <div className="flex gap-4">
            <Button variant="outline" size="sm">Twitter</Button>
            <Button variant="outline" size="sm">Facebook</Button>
            <Button variant="outline" size="sm">LinkedIn</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
