import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Page } from "@shared/schema";

interface PageContentEditorProps {
  pageSlug: string;
  onBack: () => void;
}

export default function PageContentEditor({ pageSlug, onBack }: PageContentEditorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: page, isLoading } = useQuery<Page>({
    queryKey: ["/api/pages", pageSlug],
    queryFn: async () => {
      const response = await fetch(`/api/pages/slug/${pageSlug}`);
      if (!response.ok) throw new Error("Failed to fetch page");
      return response.json();
    }
  });

  // Load page data when fetched
  useEffect(() => {
    if (page) {
      const content = JSON.parse(page.content);
      setFormData({
        title: page.title,
        metaDescription: page.metaDescription || "",
        status: page.status,
        ...content
      });
    }
  }, [page]);

  const handleInputChange = (path: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayAdd = (path: string, item: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]]) current[keys[keys.length - 1]] = [];
      current[keys[keys.length - 1]].push(item);
      return newData;
    });
  };

  const handleArrayRemove = (path: string, index: number) => {
    setFormData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]].splice(index, 1);
      return newData;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { title, metaDescription, status, ...content } = formData;
      
      const response = await fetch(`/api/pages/${page?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          metaDescription,
          status,
          content: JSON.stringify(content)
        })
      });

      if (!response.ok) throw new Error("Failed to update page");

      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      toast({
        title: "Success",
        description: "Page updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Page not found</h3>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4">
          ← Back to Pages
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit {page.title} Page</h1>
            <p className="text-gray-600">Customize your {pageSlug} page content</p>
          </div>
          <Badge variant={page.status === "published" ? "default" : "secondary"}>
            {page.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            {pageSlug === "home" && formData.hero && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input 
                        value={formData.hero?.title || ""} 
                        onChange={(e) => handleInputChange("hero.title", e.target.value)}
                        placeholder="Hero title" 
                      />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input 
                        value={formData.hero?.subtitle || ""} 
                        onChange={(e) => handleInputChange("hero.subtitle", e.target.value)}
                        placeholder="Hero subtitle" 
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea 
                        value={formData.hero?.description || ""} 
                        onChange={(e) => handleInputChange("hero.description", e.target.value)}
                        placeholder="Hero description" 
                        rows={3} 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Features
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleArrayAdd("features", { title: "", description: "", icon: "" })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Feature
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(formData.features || []).map((feature: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Feature {index + 1}</h4>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => handleArrayRemove("features", index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label>Title</Label>
                              <Input 
                                value={feature.title || ""} 
                                onChange={(e) => handleInputChange(`features.${index}.title`, e.target.value)}
                                placeholder="Feature title" 
                              />
                            </div>
                            <div>
                              <Label>Icon</Label>
                              <Input 
                                value={feature.icon || ""} 
                                onChange={(e) => handleInputChange(`features.${index}.icon`, e.target.value)}
                                placeholder="Icon name" 
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea 
                                value={feature.description || ""} 
                                onChange={(e) => handleInputChange(`features.${index}.description`, e.target.value)}
                                placeholder="Feature description" 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {pageSlug === "about" && formData.hero && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input 
                        value={formData.hero?.title || ""} 
                        onChange={(e) => handleInputChange("hero.title", e.target.value)}
                        placeholder="Hero title" 
                      />
                    </div>
                    <div>
                      <Label>Subtitle</Label>
                      <Input 
                        value={formData.hero?.subtitle || ""} 
                        onChange={(e) => handleInputChange("hero.subtitle", e.target.value)}
                        placeholder="Hero subtitle" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Content Sections
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleArrayAdd("sections", { title: "", content: "" })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Section
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(formData.sections || []).map((section: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Section {index + 1}</h4>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => handleArrayRemove("sections", index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label>Title</Label>
                              <Input 
                                value={section.title || ""} 
                                onChange={(e) => handleInputChange(`sections.${index}.title`, e.target.value)}
                                placeholder="Section title" 
                              />
                            </div>
                            <div>
                              <Label>Content</Label>
                              <Textarea 
                                value={section.content || ""} 
                                onChange={(e) => handleInputChange(`sections.${index}.content`, e.target.value)}
                                placeholder="Section content" 
                                rows={4} 
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Page Title</Label>
                  <Input 
                    value={formData.title || ""} 
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Page title" 
                  />
                </div>
                <div>
                  <Label>Meta Description</Label>
                  <Textarea 
                    value={formData.metaDescription || ""} 
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    placeholder="SEO meta description" 
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <select 
                    value={formData.status || "published"} 
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Page
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}