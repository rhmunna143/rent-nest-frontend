import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function BlogIndexPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          Rental Living Guides
        </h1>
        <p className="text-lg text-muted-foreground">
          Expert advice, market insights, and practical tips for both tenants and landlords in the modern rental ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="flex flex-col bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            {/* Optional Cover Image Placeholder */}
            <div className="h-48 bg-muted w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>
              
              <Link href={`/blog/${post.slug}`} className="group-hover:text-primary transition-colors">
                <h2 className="text-2xl font-bold mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {post.author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">{post.author}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {format(new Date(post.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
