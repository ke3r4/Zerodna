import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Setting } from "@shared/schema";

interface MetaHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
}

export default function MetaHead({ title, description, ogImage }: MetaHeadProps) {
  const { data: settings } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Get settings values
  const settingsMap = settings?.reduce((acc, setting) => {
    acc[setting.key] = setting.value || "";
    return acc;
  }, {} as Record<string, string>) || {};

  const siteName = settingsMap.siteName || "ZeroDNA";
  const siteDescription = settingsMap.siteDescription || "ZeroDNA specializes in AI solutions for healthtech, automation, and manufacturing industries.";
  const faviconUrl = settingsMap.faviconUrl;
  const primaryColor = settingsMap.primaryColor || "#1E3AE2";
  
  // Parse SEO settings
  const seoSettings = settingsMap.seoSettings ? 
    JSON.parse(settingsMap.seoSettings) : {};

  const finalTitle = title || seoSettings.metaTitle || `${siteName} - AI Solutions for the Future`;
  const finalDescription = description || seoSettings.metaDescription || siteDescription;
  const finalOgImage = ogImage || seoSettings.ogImage;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', finalDescription);
    }

    // Update Open Graph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', finalTitle);
    }

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', finalDescription);
    }

    if (finalOgImage) {
      let ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (ogImageMeta) {
        ogImageMeta.setAttribute('content', finalOgImage);
      }
    }

    // Update favicon if available
    if (faviconUrl) {
      let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = faviconUrl;
    }

    // Update theme color
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    themeColor.setAttribute('content', primaryColor);

    // Update CSS custom properties for dynamic theming
    if (primaryColor) {
      document.documentElement.style.setProperty('--zerodna-blue', primaryColor);
      
      // Convert hex to HSL for the CSS variable
      const hex = primaryColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const max = Math.max(r, g, b) / 255;
      const min = Math.min(r, g, b) / 255;
      const diff = max - min;
      
      let h = 0;
      if (diff !== 0) {
        if (max === r / 255) h = ((g - b) / 255 / diff) % 6;
        else if (max === g / 255) h = (b - r) / 255 / diff + 2;
        else h = (r - g) / 255 / diff + 4;
      }
      h = Math.round(h * 60);
      if (h < 0) h += 360;
      
      const l = (max + min) / 2;
      const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
      
      const hslValue = `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      document.documentElement.style.setProperty('--primary', hslValue);
    }
  }, [finalTitle, finalDescription, finalOgImage, faviconUrl, primaryColor]);

  return null; // This component doesn't render anything visible
}