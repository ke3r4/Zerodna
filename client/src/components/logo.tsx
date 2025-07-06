import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { Setting } from "@shared/schema";
import logoImage from "@assets/Logo (1)_1751532006588.png";

interface LogoProps {
  className?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  animationDelay?: number;
  animationType?: "fade-up" | "fade-in" | "scale" | "slide-right";
}

export default function Logo({ className = "", textColor = "text-zerodna-blue", size = "md", animated = false, animationDelay = 0, animationType = "fade-up" }: LogoProps) {
  const [isVisible, setIsVisible] = useState(!animated);
  const [hasAnimated, setHasAnimated] = useState(false);
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
  const logoUrl = settingsMap.logoUrl || logoImage;
  const settingsLogoSize = settingsMap.logoSize || "md";

  // Size mappings - adjusted for horizontal text logo layout
  const sizeClasses = {
    sm: "h-4 w-auto",
    md: "h-5 w-auto", 
    lg: "h-6 w-auto",
    xl: "h-8 w-auto"
  };

  // Animation effect
  useEffect(() => {
    if (animated && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, animationDelay);
      
      return () => clearTimeout(timer);
    }
  }, [animated, animationDelay, hasAnimated]);

  // Use settings logo size if no explicit size is provided, or use the provided size
  const finalSize = size === "md" ? settingsLogoSize as keyof typeof sizeClasses : size;
  const sizeClass = sizeClasses[finalSize];

  // Animation classes based on type
  const getAnimationClasses = () => {
    if (!animated) return '';
    
    const baseClasses = 'transition-all duration-1000 ease-out';
    
    switch (animationType) {
      case 'fade-up':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'
        }`;
      case 'fade-in':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100' 
            : 'opacity-0'
        }`;
      case 'scale':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-75'
        }`;
      case 'slide-right':
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-8'
        }`;
      default:
        return `${baseClasses} ${
          isVisible 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-4 scale-95'
        }`;
    }
  };

  const animationClasses = getAnimationClasses();

  // Always use image logo (either from settings or default)
  if (logoUrl) {
    return (
      <div className={`flex items-center ${className} ${animationClasses}`}>
        <img 
          src={logoUrl} 
          alt={siteName}
          className={`${sizeClass} object-contain`}
          onError={(e) => {
            // Fallback to text logo if image fails to load
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) {
              fallback.classList.remove('hidden');
            }
          }}
        />
        <div className={`logo-text ${textColor} relative hidden`}>
          zer
          <span className="relative inline-block">
            o
            <i className="fas fa-infinity infinity-symbol text-xs"></i>
          </span>
          dna
        </div>
      </div>
    );
  }

  // Fallback text logo (should rarely be used now)
  return (
    <div className={`flex items-center space-x-2 ${className} ${animationClasses}`}>
      <div className={`logo-text ${textColor} relative`}>
        zer
        <span className="relative inline-block">
          o
          <i className="fas fa-infinity infinity-symbol text-xs"></i>
        </span>
        dna
      </div>
      <span className="text-xs text-gray-400">TM</span>
    </div>
  );
}
