import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit3, Eye, Globe } from "lucide-react";
import type { Page } from "@shared/schema";

interface PageContentListProps {
  onEditContent: (slug: string) => void;
}

export default function PageContentList({ onEditContent }: PageContentListProps) {
  const { data: pages, isLoading } = useQuery<Page[]>({
    queryKey: ["/api/pages"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <div className="grid gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-6 w-32 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const mainPages = pages?.filter(page => 
    ['home', 'about', 'services', 'contact'].includes(page.slug)
  ) || [];

  const pageDescriptions = {
    home: "Your website's main landing page with hero section and key features",
    about: "Company information, mission, and team details",
    services: "Detailed overview of your services and offerings",
    contact: "Contact information and inquiry form configuration"
  };

  const pageIcons = {
    home: Globe,
    about: Eye,
    services: Edit3,
    contact: Edit3
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Page Content Management</h2>
          <p className="text-gray-600 mt-1">Edit the content of your main website pages</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mainPages.map((page) => {
          const IconComponent = pageIcons[page.slug as keyof typeof pageIcons] || Edit3;
          
          return (
            <Card key={page.id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={page.status === "published" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {page.status}
                        </Badge>
                        <span className="text-xs text-gray-500">/{page.slug}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="mb-4">
                  {pageDescriptions[page.slug as keyof typeof pageDescriptions] || "Manage page content"}
                </CardDescription>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => onEditContent(page.slug)}
                    size="sm"
                    className="flex-1"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Content
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/${page.slug === 'home' ? '' : page.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mainPages.length === 0 && (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No pages found</h3>
          <p className="text-gray-600 mt-2">Main website pages are not yet available for editing.</p>
        </div>
      )}
    </div>
  );
}