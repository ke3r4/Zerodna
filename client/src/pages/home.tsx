import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostCardSkeleton } from "@/components/ui/loading-skeletons";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Logo from "@/components/logo";
import type { Post } from "@shared/schema";

export default function Home() {
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts/published"],
  });

  const featuredPosts = posts?.slice(0, 3) || [];

  // Apply scroll animations to this page
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Logo 
              className="mx-auto mb-6" 
              textColor="text-white"
              size="xl"
              animated={true}
              animationType="scale"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Intelligent AI Solutions
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300">
            Transforming healthcare, automation, and manufacturing through cutting-edge artificial intelligence technology
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Link href="/services">Explore Services</Link>
            </Button>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-on-scroll text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Solutions Across Industries</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent, adaptive solutions are engineered to transform healthcare, automation, and manufacturing through cutting-edge AI technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* HealthTech Service */}
            <div className="fade-in-on-scroll">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <i className="fas fa-heartbeat text-2xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">HealthTech AI</h3>
                  <p className="text-gray-600 mb-4">
                    Revolutionize patient care with intelligent diagnostic tools and predictive health analytics.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Diagnostic assistance
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Predictive analytics
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Patient monitoring
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Automation Service */}
            <div className="fade-in-on-scroll fade-in-delayed">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <i className="fas fa-robot text-2xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Automation AI</h3>
                  <p className="text-gray-600 mb-4">
                    Streamline operations with intelligent automation that learns and adapts to your processes.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Process optimization
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Predictive maintenance
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Quality assurance
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Manufacturing Service */}
            <div className="fade-in-on-scroll fade-in-delayed-2">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <i className="fas fa-industry text-2xl text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Manufacturing AI</h3>
                  <p className="text-gray-600 mb-4">
                    Optimize production with AI-driven insights and real-time monitoring systems.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Supply chain optimization
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Production scheduling
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Real-time analytics
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-on-scroll">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose ZeroDNA?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe in the power of AI to transform industries and improve lives. Our solutions are designed with precision, built for scalability, and engineered for impact.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-blue-600 mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Industry Expertise</h3>
                    <p className="text-gray-600">Deep understanding of healthcare, automation, and manufacturing challenges</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-blue-600 mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Cutting-Edge Technology</h3>
                    <p className="text-gray-600">Latest AI and machine learning technologies integrated into practical solutions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-check-circle text-blue-600 mr-3 mt-1"></i>
                  <div>
                    <h3 className="font-semibold text-gray-900">Proven Results</h3>
                    <p className="text-gray-600">Track record of successful implementations and measurable improvements</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade-in-on-scroll fade-in-delayed">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
                <p className="mb-6">
                  Let's discuss how our AI solutions can revolutionize your operations and drive unprecedented growth.
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/contact">Get Started Today</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {(postsLoading || featuredPosts.length > 0) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fade-in-on-scroll text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Insights</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest developments in AI technology and industry trends.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {postsLoading
                ? [...Array(3)].map((_, index) => (
                    <div key={index} className={`fade-in-on-scroll ${index === 1 ? 'fade-in-delayed' : index === 2 ? 'fade-in-delayed-2' : ''}`}>
                      <PostCardSkeleton />
                    </div>
                  ))
                : featuredPosts.map((post, index) => (
                    <div key={post.id} className={`fade-in-on-scroll ${index === 1 ? 'fade-in-delayed' : index === 2 ? 'fade-in-delayed-2' : ''}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                            <i className="fas fa-image text-gray-400 text-3xl"></i>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="outline" size="sm">
                              Read More
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  ))
              }
            </div>
          </div>
        </section>
      )}
    </div>
  );
}