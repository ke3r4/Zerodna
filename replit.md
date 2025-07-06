# ZeroDNA AI Solutions Platform

## Overview

ZeroDNA is a modern full-stack web application built for showcasing AI solutions in healthcare, automation, and manufacturing industries. The platform features a content management system (CMS) for managing pages, blog posts, and articles, along with a public-facing website with modern UI components.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and build processes

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Supabase connection
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Prepared for connect-pg-simple (PostgreSQL session store)
- **Development**: Hot module replacement via Vite integration

### Database Schema
The application uses a content-focused database schema with the following main entities:
- **Users**: Authentication and user management
- **Pages**: Static website pages with SEO metadata
- **Posts**: Blog posts with categories and featured images
- **Articles**: Long-form content similar to posts
- **Media**: File upload and management system
- **Settings**: Website configuration including branding, contact info, and SEO settings

All content entities support draft/published/private status workflow and include SEO-friendly fields like slugs and meta descriptions.

## Key Components

### Content Management System
- **Admin Dashboard**: Statistics overview and content management interface with role/permission metrics
- **Content Editor**: Rich form-based editor for pages, posts, and articles
- **Content List**: Paginated listing with search, filter, and bulk operations
- **Media Library**: File upload and management system
- **Website Settings**: Comprehensive settings management including logo upload, branding, contact info, and SEO
- **User Management**: Complete user account management with role assignment
- **Role Management**: Hierarchical role system with permission assignment interface

### Advanced Role and Permission System
- **Hierarchical Roles**: 6 default roles (Super Admin, Admin, Editor, Author, Viewer, Guest) with configurable permission levels
- **Granular Permissions**: 36 default permissions covering all system resources (users, roles, permissions, pages, posts, articles, media, settings, dashboard)
- **Permission Inheritance**: Users inherit permissions from assigned roles plus direct permission assignments
- **Permission Revocation**: Explicit deny permissions can override role-based grants
- **Temporal Access**: Support for time-limited role assignments and permission grants
- **Audit Trail**: Track who assigned roles/permissions and when
- **Middleware Protection**: Server-side permission checking for API endpoints
- **UI Access Control**: Frontend components respect user permissions for conditional rendering

### Authentication System
- **Session-Based Authentication**: Secure server-side session management with memory store
- **Admin-Only Access**: No public user registration - all user creation managed by administrators
- **Protected Routes**: All admin API endpoints require authentication middleware
- **Login Interface**: Dedicated login page with form validation and error handling
- **Default Credentials**: Pre-seeded admin account (username: admin_user, password: hashed_password_123)
- **Automatic Redirects**: Unauthenticated users redirected to login with toast notifications
- **Session Management**: Secure logout functionality with session destruction

### Public Website
- **Homepage**: Hero section with company overview and featured content
- **About Page**: Company philosophy and team information
- **Services Page**: Detailed service offerings with features and benefits
- **Blog**: Published posts with categories and search functionality
- **Contact Page**: Contact form with industry-specific options

## Data Flow

1. **Content Creation**: Admins create/edit content through the CMS interface
2. **Data Persistence**: Content is stored in PostgreSQL via Drizzle ORM
3. **Public Display**: Published content is served to public pages via REST API
4. **Real-time Updates**: TanStack Query manages cache invalidation and refetching

## External Dependencies

### Database
- **Supabase**: PostgreSQL database hosting with real-time capabilities
- **Connection**: Standard PostgreSQL connection with SSL support

### UI Libraries
- **Radix UI**: Unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library for consistent iconography

### Development Tools
- **Replit Integration**: Development environment optimization
- **Error Overlay**: Runtime error display in development
- **TypeScript**: Static type checking throughout the stack

## Deployment Strategy

### Development
- **Local Development**: `npm run dev` starts both frontend and backend with HMR
- **Database Migrations**: `npm run db:push` applies schema changes
- **Type Checking**: `npm run check` validates TypeScript across the project

### Production
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Static Assets**: Frontend assets served from `dist/public`
- **Server**: Express server serves both API and static files
- **Environment**: Production mode with optimized builds and caching

The application is designed for deployment on platforms that support Node.js with PostgreSQL databases, with specific optimizations for Replit's environment.

## Changelog

Changelog:
- July 02, 2025. Initial setup
- January 02, 2025. Added comprehensive website settings system with logo management, branding controls, contact information, social media links, and SEO settings. Implemented dynamic theming and favicon support.
- January 02, 2025. Implemented advanced user roles and permission system with hierarchical access control, including user management, role management, permission assignment, and middleware for API protection.
- January 02, 2025. Converted admin system to login-only access with session authentication. Changed public admin button to login button. User creation is now exclusive to authenticated administrators. Fixed login credentials and updated system to use existing seeded admin user (admin_user/hashed_password_123).
- July 03, 2025. Completed dynamic page navigation system. Pages created through admin panel now appear automatically in website header navigation. Added authentication protection to page creation/editing routes and implemented dynamic page display functionality.
- July 03, 2025. Implemented comprehensive animated loading skeletons for improved perceived performance. Added skeleton components for posts, service cards, table rows, forms, and dashboard stats. Enhanced loading states across homepage, admin dashboard, content lists, and page management components with smooth pulse animations.
- July 06, 2025. Migrated backend database from Neon to Supabase for improved scalability and real-time capabilities. Updated database connection to use standard PostgreSQL with SSL support. Maintained all existing functionality while preparing for future Supabase features.

## User Preferences

Preferred communication style: Simple, everyday language.