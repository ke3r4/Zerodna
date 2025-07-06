import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { Post } from "@shared/schema";

export default function Blog() {
  // Apply scroll animations to this page
  useScrollAnimation();
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/published"],
  });

  if (isLoading) {
    return (
      <div>
        <section className="py-20 bg-zerodna-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
          </div>
        </section>
        
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-zerodna-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-on-scroll">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Latest Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Stay updated with the latest developments in AI technology and industry insights from our experts. 
              Discover how artificial intelligence is transforming industries and shaping the future.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-blog text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No blog posts yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're working on bringing you the latest insights in AI and technology. 
                Check back soon for our first posts!
              </p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {posts.length > 0 && (
                <div className="mb-16">
                  <div className="text-center mb-8">
                    <Badge variant="secondary" className="bg-zerodna-blue text-white">
                      Featured Article
                    </Badge>
                  </div>
                  
                  <Card className="shadow-lg">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {posts[0].featuredImage && (
                        <img 
                          src={posts[0].featuredImage} 
                          alt={posts[0].title}
                          className="w-full h-64 lg:h-full object-cover"
                        />
                      )}
                      <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                        {posts[0].category && (
                          <Badge variant="outline" className="w-fit mb-4 text-zerodna-blue border-zerodna-blue">
                            {posts[0].category}
                          </Badge>
                        )}
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          {posts[0].title}
                        </h2>
                        {posts[0].excerpt && (
                          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {posts[0].excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-calendar mr-2"></i>
                          <span>{new Date(posts[0].createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              )}
              
              {/* All Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(1).map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    {post.featuredImage && (
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-6">
                      {post.category && (
                        <Badge variant="outline" className="mb-3 text-zerodna-blue border-zerodna-blue">
                          {post.category}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <i className="fas fa-calendar mr-2"></i>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="text-zerodna-blue hover:underline cursor-pointer">
                          Read more
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-zerodna-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-on-scroll text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Explore by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover insights across different areas of AI and technology innovation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "AI Research", icon: "fas fa-brain", count: 12, color: "bg-blue-500" },
              { name: "Healthcare", icon: "fas fa-heartbeat", count: 8, color: "bg-red-500" },
              { name: "Automation", icon: "fas fa-cogs", count: 15, color: "bg-green-500" },
              { name: "Manufacturing", icon: "fas fa-industry", count: 6, color: "bg-purple-500" }
            ].map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${category.icon} text-white`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8">
              Subscribe to our newsletter and never miss the latest AI insights and technology trends.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-zerodna-blue"
              />
              <button className="bg-zerodna-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
