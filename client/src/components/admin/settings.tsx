import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import FileUpload from "@/components/ui/file-upload";
import LogoSizeSlider from "@/components/ui/logo-size-slider";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Setting } from "@shared/schema";

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100),
  siteDescription: z.string().max(200).optional(),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  faviconUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  logoSize: z.enum(["sm", "md", "lg", "xl"]).default("md"),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Must be a valid hex color").optional(),
  contactEmail: z.string().email("Must be a valid email").optional(),
  contactPhone: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
  }).optional(),
  seoSettings: z.object({
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    ogImage: z.string().url().optional().or(z.literal("")),
    analytics: z.string().optional(),
  }).optional(),
  maintenanceMode: z.boolean().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock file upload function - in a real app, this would upload to cloud storage
  const handleFileUpload = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const { data: settings, isLoading } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "ZeroDNA",
      siteDescription: "",
      logoUrl: "",
      faviconUrl: "",
      logoSize: "md",
      primaryColor: "#1E3AE2",
      contactEmail: "",
      contactPhone: "",
      socialLinks: {
        linkedin: "",
        twitter: "",
        github: "",
      },
      seoSettings: {
        metaTitle: "",
        metaDescription: "",
        ogImage: "",
        analytics: "",
      },
      maintenanceMode: false,
    }
  });

  // Convert settings array to form data
  useEffect(() => {
    if (settings) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value || "";
        return acc;
      }, {} as Record<string, string>);

      // Parse JSON values for nested objects
      const socialLinks = settingsMap.socialLinks ? 
        JSON.parse(settingsMap.socialLinks) : {};
      const seoSettings = settingsMap.seoSettings ? 
        JSON.parse(settingsMap.seoSettings) : {};

      form.reset({
        siteName: settingsMap.siteName || "ZeroDNA",
        siteDescription: settingsMap.siteDescription || "",
        logoUrl: settingsMap.logoUrl || "",
        faviconUrl: settingsMap.faviconUrl || "",
        logoSize: (settingsMap.logoSize as "sm" | "md" | "lg" | "xl") || "md",
        primaryColor: settingsMap.primaryColor || "#1E3AE2",
        contactEmail: settingsMap.contactEmail || "",
        contactPhone: settingsMap.contactPhone || "",
        socialLinks,
        seoSettings,
        maintenanceMode: settingsMap.maintenanceMode === "true",
      });
    }
  }, [settings, form]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const existingSetting = settings?.find(s => s.key === key);
      
      if (existingSetting) {
        return apiRequest('PUT', `/api/settings/${key}`, { value });
      } else {
        return apiRequest('POST', '/api/settings', {
          key,
          value,
          type: typeof value === 'object' ? 'json' : 'text',
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          description: `${key} setting`
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      const updates = [
        { key: 'siteName', value: data.siteName },
        { key: 'siteDescription', value: data.siteDescription || '' },
        { key: 'logoUrl', value: data.logoUrl || '' },
        { key: 'faviconUrl', value: data.faviconUrl || '' },
        { key: 'primaryColor', value: data.primaryColor || '#1E3AE2' },
        { key: 'contactEmail', value: data.contactEmail || '' },
        { key: 'contactPhone', value: data.contactPhone || '' },
        { key: 'socialLinks', value: JSON.stringify(data.socialLinks || {}) },
        { key: 'seoSettings', value: JSON.stringify(data.seoSettings || {}) },
        { key: 'maintenanceMode', value: String(data.maintenanceMode || false) },
      ];

      await Promise.all(
        updates.map(update => updateSettingMutation.mutateAsync(update))
      );

      toast({
        title: "Settings updated",
        description: "Your website settings have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Settings</h1>
            <p className="text-gray-600">Configure your website settings and preferences.</p>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="bg-zerodna-blue text-white hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="siteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="ZeroDNA" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Brief description of your website..."
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={form.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Maintenance Mode</FormLabel>
                            <p className="text-sm text-gray-600">
                              Enable to show a maintenance page to visitors
                            </p>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branding" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Logo & Branding</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <FileUpload
                                onUpload={async (file) => {
                                  const url = await handleFileUpload(file);
                                  field.onChange(url);
                                  return url;
                                }}
                                accept="image/*"
                                maxSize={2}
                                currentValue={field.value}
                                placeholder="Upload your company logo"
                                className="w-full"
                              />
                              <Input 
                                {...field} 
                                placeholder="Or enter logo URL: https://example.com/logo.png"
                                type="url"
                                className="mt-2"
                              />
                            </div>
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Upload a logo file or enter a URL. Leave empty to use the default text logo.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="faviconUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Favicon</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <FileUpload
                                onUpload={async (file) => {
                                  const url = await handleFileUpload(file);
                                  field.onChange(url);
                                  return url;
                                }}
                                accept="image/*"
                                maxSize={1}
                                currentValue={field.value}
                                placeholder="Upload favicon (32x32 or 16x16px)"
                                className="w-full"
                              />
                              <Input 
                                {...field} 
                                placeholder="Or enter favicon URL: https://example.com/favicon.ico"
                                type="url"
                              />
                            </div>
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Upload a favicon file or enter a URL (32x32 or 16x16 pixels recommended).
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logoSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo Size</FormLabel>
                          <FormControl>
                            <LogoSizeSlider
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Adjust the size of your logo across the website. Changes are previewed in real-time.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <Input 
                                {...field} 
                                placeholder="#1E3AE2"
                                className="w-32"
                              />
                              <div 
                                className="w-12 h-12 rounded-lg border border-gray-300"
                                style={{ backgroundColor: field.value || "#1E3AE2" }}
                              />
                            </div>
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Primary brand color used throughout the website.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="contact@zerodna.com"
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="+49 15560 734148"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Social Media Links</h4>
                      
                      <FormField
                        control={form.control}
                        name="socialLinks.linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="https://linkedin.com/company/zerodna"
                                type="url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialLinks.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="https://twitter.com/zerodna"
                                type="url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialLinks.github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="https://github.com/zerodna"
                                type="url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="seoSettings.metaTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="ZeroDNA - AI Solutions for the Future"
                              maxLength={60}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Default title for pages without a specific title (max 60 characters).
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoSettings.metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="ZeroDNA specializes in AI solutions for healthtech, automation, and manufacturing..."
                              rows={3}
                              maxLength={160}
                            />
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Default description for search engines (max 160 characters).
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoSettings.ogImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Open Graph Image</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="https://example.com/og-image.jpg"
                              type="url"
                            />
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Default image for social media sharing (1200x630 pixels recommended).
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoSettings.analytics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Analytics ID</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="G-XXXXXXXXXX"
                            />
                          </FormControl>
                          <p className="text-sm text-gray-600">
                            Google Analytics tracking ID for website analytics.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}