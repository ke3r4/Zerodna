import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  // Fetch published pages
  const { data: pages } = useQuery({
    queryKey: ["/api/pages/published"],
    retry: false,
  });

  // Static navigation items
  const staticNavItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  // Get additional dynamic pages (excluding those that are already in static nav)
  const staticSlugs = staticNavItems.map(item => item.href.slice(1) || 'home'); // Remove leading '/' and handle home case
  const dynamicPageItems = pages && Array.isArray(pages) 
    ? pages
        .filter((page: any) => page.status === 'published' && !staticSlugs.includes(page.slug))
        .map((page: any) => ({
          href: `/${page.slug}`,
          label: page.title
        }))
    : [];

  const navItems = [...staticNavItems, ...dynamicPageItems];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-16 py-1">
          {/* Logo */}
          <Link href="/">
            <Logo size="lg" className="hover:opacity-80 transition-opacity" animated={true} animationDelay={100} animationType="slide-right" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-zerodna-blue"
                      : "text-gray-700 hover:text-zerodna-blue"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            
            {isLoading ? (
              <Button disabled className="bg-gray-400 text-white">
                Loading...
              </Button>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button className="bg-zerodna-blue text-white hover:bg-blue-700">
                    Admin Panel
                  </Button>
                </Link>
                <Button 
                  onClick={() => window.location.href = '/api/auth/logout'} 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-zerodna-blue text-white hover:bg-blue-700">
                  Login
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <i className="fas fa-bars text-xl text-gray-600"></i>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`block py-2 px-4 rounded-lg font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-zerodna-blue bg-blue-50"
                          : "text-gray-700 hover:text-zerodna-blue hover:bg-gray-50"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                
                {isLoading ? (
                  <Button disabled className="w-full bg-gray-400 text-white">
                    Loading...
                  </Button>
                ) : isAuthenticated ? (
                  <div className="space-y-2">
                    <Link href="/admin">
                      <Button 
                        className="w-full bg-zerodna-blue text-white hover:bg-blue-700"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin Panel
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = '/api/auth/logout';
                      }} 
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button 
                      className="w-full bg-zerodna-blue text-white hover:bg-blue-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
