import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/components/admin/dashboard";
import ContentList from "@/components/admin/content-list";
import ContentEditor from "@/components/admin/content-editor";
import Settings from "@/components/admin/settings";
import PageContentEditor from "@/components/admin/page-content-editor";
import PageContentList from "@/components/admin/page-content-list";
import UserManagement from "@/components/admin/user-management";
import RoleManagement from "@/components/admin/role-management";

type AdminSection = 'dashboard' | 'pages' | 'posts' | 'articles' | 'media' | 'users' | 'roles' | 'settings';
type ContentType = 'page' | 'post' | 'article';

export default function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditingPageContent, setIsEditingPageContent] = useState(false);
  const [editingPageSlug, setEditingPageSlug] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access the admin panel.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render admin content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const sectionTitles = {
    dashboard: { title: 'Dashboard', description: 'Overview of your website content and performance.' },
    pages: { title: 'Pages', description: 'Manage website pages and their content.' },
    posts: { title: 'Blog Posts', description: 'Create and manage blog posts.' },
    articles: { title: 'Articles', description: 'Manage articles and publications.' },
    media: { title: 'Media Library', description: 'Manage uploaded images and files.' },
    users: { title: 'User Management', description: 'Manage user accounts and profiles.' },
    roles: { title: 'Role Management', description: 'Manage user roles and permissions.' },
    settings: { title: 'Settings', description: 'Configure website settings and preferences.' }
  };

  const navItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', name: 'Dashboard' },
    { id: 'pages', icon: 'fas fa-file-alt', name: 'Pages' },
    { id: 'posts', icon: 'fas fa-blog', name: 'Blog Posts' },
    { id: 'articles', icon: 'fas fa-newspaper', name: 'Articles' },
    { id: 'media', icon: 'fas fa-images', name: 'Media Library' },
    { id: 'users', icon: 'fas fa-users', name: 'Users' },
    { id: 'roles', icon: 'fas fa-user-shield', name: 'Roles' },
    { id: 'settings', icon: 'fas fa-cog', name: 'Settings' }
  ];

  const handleNavClick = (section: AdminSection) => {
    setCurrentSection(section);
    setIsEditing(false);
    setEditingId(null);
    setIsEditingPageContent(false);
    setEditingPageSlug(null);
    setIsSidebarOpen(false);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setIsEditing(true);
  };

  const handleBackToList = () => {
    setIsEditing(false);
    setEditingId(null);
    setIsEditingPageContent(false);
    setEditingPageSlug(null);
  };

  const handleEditPageContent = (slug: string) => {
    setEditingPageSlug(slug);
    setIsEditingPageContent(true);
  };

  const getContentType = (): ContentType => {
    if (currentSection === 'pages') return 'page';
    if (currentSection === 'posts') return 'post';
    if (currentSection === 'articles') return 'article';
    return 'post';
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const SidebarContent = () => (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        {user && (
          <p className="text-sm text-gray-600 mt-2">
            Welcome, {user.firstName || user.username}
          </p>
        )}
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id as AdminSection)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center space-x-3 transition-colors ${
                  currentSection === item.id
                    ? 'bg-zerodna-blue text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className={`${item.icon} ${currentSection === item.id ? 'text-white' : 'text-gray-600'}`}></i>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="w-full flex items-center space-x-2"
        >
          <i className="fas fa-sign-out-alt text-gray-600"></i>
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white shadow-sm border-r border-gray-200">
          <SidebarContent />
        </div>
        
        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <i className="fas fa-bars"></i>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentSection === 'dashboard' && !isEditing && (
            <Dashboard />
          )}
          
          {currentSection === 'pages' && !isEditing && !isEditingPageContent && (
            <ContentList
              type="page"
              title={sectionTitles[currentSection].title}
              description={sectionTitles[currentSection].description}
              onEdit={handleEdit}
              onCreate={handleCreate}
            />
          )}

          {['posts', 'articles'].includes(currentSection) && !isEditing && (
            <ContentList
              type={getContentType()}
              title={sectionTitles[currentSection].title}
              description={sectionTitles[currentSection].description}
              onEdit={handleEdit}
              onCreate={handleCreate}
            />
          )}

          {isEditingPageContent && editingPageSlug && (
            <div className="p-8">
              <PageContentEditor 
                pageSlug={editingPageSlug}
                onBack={handleBackToList}
              />
            </div>
          )}
          
          {isEditing && (
            <ContentEditor
              type={getContentType()}
              id={editingId}
              onBack={handleBackToList}
            />
          )}
          
          {currentSection === 'media' && (
            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
                <p className="text-gray-600">Manage uploaded images and files.</p>
              </div>
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-images text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Media Library</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Upload and manage your images, documents, and other media files.
                </p>
                <Button className="bg-zerodna-blue text-white hover:bg-blue-700">
                  <i className="fas fa-upload mr-2"></i>Upload Files
                </Button>
              </div>
            </div>
          )}
          
          {currentSection === 'users' && !isEditing && (
            <UserManagement />
          )}

          {currentSection === 'roles' && !isEditing && (
            <RoleManagement />
          )}
          
          {currentSection === 'settings' && !isEditing && (
            <Settings />
          )}
        </div>
      </div>
    </div>
  );
}
