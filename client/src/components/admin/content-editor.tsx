import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { insertPageSchema, insertPostSchema, insertArticleSchema } from "@shared/schema";
import type { Page, Post, Article } from "@shared/schema";

interface ContentEditorProps {
  type: 'page' | 'post' | 'article';
  id?: number | null;
  onBack: () => void;
}

// Create form schemas with proper validation
const createFormSchema = (type: 'page' | 'post' | 'article') => {
  const baseSchema = {
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    slug: z.string().min(1, "Slug is required").max(100, "Slug must be less than 100 characters")
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
    content: z.string().min(1, "Content is required"),
    metaDescription: z.string().max(160, "Meta description must be less than 160 characters").optional(),
    status: z.enum(["draft", "published", "private"]).default("draft")
  };

  if (type === 'page') {
    return z.object(baseSchema);
  } else {
    return z.object({
      ...baseSchema,
      excerpt: z.string().max(300, "Excerpt must be less than 300 characters").optional(),
      featuredImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
      category: z.string().max(50, "Category must be less than 50 characters").optional()
    });
  }
};

export default function ContentEditor({ type, id, onBack }: ContentEditorProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = id !== null && id !== undefined;
  const formSchema = createFormSchema(type);
  
  // Fetch existing content if editing
  const { data: content, isLoading } = useQuery({
    queryKey: [`/api/${type}s`, id],
    queryFn: () => {
      if (!isEditing) return null;
      switch (type) {
        case 'page':
          return api.pages.getById(id);
        case 'post':
          return api.posts.getById(id);
        case 'article':
          return api.articles.getById(id);
        default:
          return null;
      }
    },
    enabled: isEditing
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      metaDescription: "",
      status: "draft" as const,
      ...(type !== 'page' && {
        excerpt: "",
        featuredImage: "",
        category: ""
      })
    }
  });

  // Update form values when content is loaded
  useEffect(() => {
    if (content && isEditing) {
      form.reset({
        title: content.title,
        slug: content.slug,
        content: content.content,
        metaDescription: content.metaDescription || "",
        status: content.status,
        ...(type !== 'page' && 'excerpt' in content && {
          excerpt: content.excerpt || "",
          featuredImage: content.featuredImage || "",
          category: content.category || ""
        })
      });
    }
  }, [content, isEditing, form, type]);

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && !isEditing) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitle, form, isEditing]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      switch (type) {
        case 'page':
          return api.pages.create(data);
        case 'post':
          return api.posts.create(data);
        case 'article':
          return api.articles.create(data);
        default:
          throw new Error("Invalid content type");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`] });
      toast({
        title: "Content created",
        description: `The ${type} has been successfully created.`,
      });
      onBack();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to create ${type}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!id) throw new Error("No ID provided for update");
      switch (type) {
        case 'page':
          return api.pages.update(id, data);
        case 'post':
          return api.posts.update(id, data);
        case 'article':
          return api.articles.update(id, data);
        default:
          throw new Error("Invalid content type");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`] });
      queryClient.invalidateQueries({ queryKey: [`/api/${type}s`, id] });
      toast({
        title: "Content updated",
        description: `The ${type} has been successfully updated.`,
      });
      onBack();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to update ${type}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = () => {
    form.setValue("status", "published");
    form.handleSubmit(onSubmit)();
  };

  const handleSaveDraft = () => {
    form.setValue("status", "draft");
    form.handleSubmit(onSubmit)();
  };

  if (isLoading && isEditing) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-8 space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <i className="fas fa-arrow-left"></i>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditing ? `Edit ${type}` : `Create ${type}`}
              </h1>
              <p className="text-gray-600">
                {isEditing ? `Update your ${type} content.` : `Create and publish your ${type}.`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting}
              className="bg-zerodna-blue text-white hover:bg-blue-700"
            >
              {isEditing ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Title *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter content title..."
                          className="text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Slug *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="content-url-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid md:grid-cols-2 gap-6">
                  {type !== 'page' && (
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">Category</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AI Research">AI Research</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Automation">Automation</SelectItem>
                                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="Technology">Technology</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Status</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {type !== 'page' && (
                  <>
                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">Featured Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" type="url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">Excerpt</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Brief description or excerpt..."
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Content *</FormLabel>
                      <FormControl>
                        <div className="border border-gray-200 rounded-lg">
                          <div className="border-b border-gray-200 p-3 bg-gray-50">
                            <div className="flex items-center space-x-2">
                              <Button type="button" variant="ghost" size="sm" className="p-2">
                                <i className="fas fa-bold"></i>
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="p-2">
                                <i className="fas fa-italic"></i>
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="p-2">
                                <i className="fas fa-underline"></i>
                              </Button>
                              <div className="w-px h-6 bg-gray-300"></div>
                              <Button type="button" variant="ghost" size="sm" className="p-2">
                                <i className="fas fa-list-ul"></i>
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="p-2">
                                <i className="fas fa-list-ol"></i>
                              </Button>
                              <div className="w-px h-6 bg-gray-300"></div>
                              <Button type="button" variant="ghost" size="sm" className="p-2">
                                <i className="fas fa-link"></i>
                              </Button>
                              <Button type="button" variant="ghost" size="sm" className="p-2">
                                <i className="fas fa-image"></i>
                              </Button>
                            </div>
                          </div>
                          <Textarea 
                            {...field} 
                            placeholder="Start writing your content..."
                            className="content-editor border-0 focus:ring-0 resize-none"
                            rows={20}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">SEO Meta Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Brief description for search engines..."
                          rows={3}
                        />
                      </FormControl>
                      <p className="text-sm text-gray-500">
                        {field.value?.length || 0}/160 characters recommended
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
