import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardStatsSkeleton } from "@/components/ui/loading-skeletons";
import type { Page, Post, Article, User, Role, Permission } from "@shared/schema";

export default function Dashboard() {
  const { data: pages, isLoading: pagesLoading } = useQuery<Page[]>({
    queryKey: ["/api/pages"],
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: articles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: roles, isLoading: rolesLoading } = useQuery<Role[]>({
    queryKey: ["/api/roles"],
  });

  const { data: permissions, isLoading: permissionsLoading } = useQuery<Permission[]>({
    queryKey: ["/api/permissions"],
  });

  const isLoading = pagesLoading || postsLoading || articlesLoading || usersLoading || rolesLoading || permissionsLoading;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Pages",
      value: pages?.length || 0,
      icon: "fas fa-file-alt",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Blog Posts",
      value: posts?.length || 0,
      icon: "fas fa-blog",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Articles",
      value: articles?.length || 0,
      icon: "fas fa-newspaper",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: "fas fa-users",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100"
    },
    {
      title: "User Roles",
      value: roles?.length || 0,
      icon: "fas fa-user-shield",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Permissions",
      value: permissions?.length || 0,
      icon: "fas fa-key",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  const recentContent = [
    ...(pages?.slice(0, 3).map(p => ({ ...p, type: 'Page' })) || []),
    ...(posts?.slice(0, 3).map(p => ({ ...p, type: 'Post' })) || []),
    ...(articles?.slice(0, 3).map(a => ({ ...a, type: 'Article' })) || [])
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your website content and performance.</p>
      </div>
      
      {isLoading ? (
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <i className={`${stat.icon} ${stat.color}`}></i>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Content</h3>
            {recentContent.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-alt text-2xl text-gray-400"></i>
                </div>
                <p className="text-gray-600">No content yet</p>
                <p className="text-sm text-gray-500">Create your first page, post, or article to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentContent.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'published' ? 'bg-green-500' : 
                      item.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1">
                      <span className="text-gray-600">{item.type}: {item.title}</span>
                      <div className="text-sm text-gray-400">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full bg-zerodna-blue text-white hover:bg-blue-700">
                <i className="fas fa-plus mr-2"></i>Create New Page
              </Button>
              <Button variant="outline" className="w-full">
                <i className="fas fa-blog mr-2"></i>Add Blog Post
              </Button>
              <Button variant="outline" className="w-full">
                <i className="fas fa-newspaper mr-2"></i>Write Article
              </Button>
              <Button variant="outline" className="w-full">
                <i className="fas fa-upload mr-2"></i>Upload Media
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
