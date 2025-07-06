import { apiRequest } from "./queryClient";

export const api = {
  // Pages
  pages: {
    getAll: () => fetch("/api/pages").then(res => res.json()),
    getById: (id: number) => fetch(`/api/pages/${id}`).then(res => res.json()),
    getBySlug: (slug: string) => fetch(`/api/pages/slug/${slug}`).then(res => res.json()),
    create: (data: any) => apiRequest("POST", "/api/pages", data),
    update: (id: number, data: any) => apiRequest("PUT", `/api/pages/${id}`, data),
    delete: (id: number) => apiRequest("DELETE", `/api/pages/${id}`)
  },

  // Posts
  posts: {
    getAll: () => fetch("/api/posts").then(res => res.json()),
    getPublished: () => fetch("/api/posts/published").then(res => res.json()),
    getById: (id: number) => fetch(`/api/posts/${id}`).then(res => res.json()),
    getBySlug: (slug: string) => fetch(`/api/posts/slug/${slug}`).then(res => res.json()),
    create: (data: any) => apiRequest("POST", "/api/posts", data),
    update: (id: number, data: any) => apiRequest("PUT", `/api/posts/${id}`, data),
    delete: (id: number) => apiRequest("DELETE", `/api/posts/${id}`)
  },

  // Articles
  articles: {
    getAll: () => fetch("/api/articles").then(res => res.json()),
    getPublished: () => fetch("/api/articles/published").then(res => res.json()),
    getById: (id: number) => fetch(`/api/articles/${id}`).then(res => res.json()),
    getBySlug: (slug: string) => fetch(`/api/articles/slug/${slug}`).then(res => res.json()),
    create: (data: any) => apiRequest("POST", "/api/articles", data),
    update: (id: number, data: any) => apiRequest("PUT", `/api/articles/${id}`, data),
    delete: (id: number) => apiRequest("DELETE", `/api/articles/${id}`)
  },

  // Media
  media: {
    getAll: () => fetch("/api/media").then(res => res.json()),
    getById: (id: number) => fetch(`/api/media/${id}`).then(res => res.json()),
    create: (data: any) => apiRequest("POST", "/api/media", data),
    delete: (id: number) => apiRequest("DELETE", `/api/media/${id}`)
  },

  // Settings
  settings: {
    getAll: () => fetch("/api/settings").then(res => res.json()),
    getByKey: (key: string) => fetch(`/api/settings/${key}`).then(res => res.json()),
    update: (key: string, value: string) => apiRequest("PUT", `/api/settings/${key}`, { value }),
    create: (data: any) => apiRequest("POST", "/api/settings", data)
  }
};

export { apiRequest };
