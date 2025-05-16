# InVegas702 Digital Magazine Platform

## 🌟 Project Overview

InVegas702 is a modern digital magazine platform focused on Las Vegas lifestyle, entertainment, and business content. The platform features digital magazines, articles, and events in a sleek, responsive web application built with Next.js and Supabase.

## ✅ Completed Features

### Core Platform
- Authentication and authorization with admin role management
- Modern and responsive UI optimized for both desktop and mobile experiences
- Server-side and client-side data fetching with appropriate caching
- Magazine display with PDF viewer
- Articles management with rich text and images
- Events management with complete CRUD operations
- Admin dashboard for content management

### Magazine Features
- Digital magazine browsing with cover images
- PDF viewing directly in the platform
- Latest issue promotion on homepage

### Article Features
- Article listing with cover images and metadata
- Article detail page with modern two-column layout
- Featured article support
- Social sharing integration
- Related articles section
- Draft/published status handling
- Author information display

### Event Features
- Events listing with date, location, and images
- Event detail page with modern layout matching articles
- Interactive social sharing
- Related/upcoming events display
- Draft/published status management

### Admin Features
- Secure admin dashboard with role-based access control
- Magazine management (add, edit, delete)
- Article management with image uploads
- Event management with date/time handling
- Confirmation dialogs for deletion operations
- Status toggling between draft and published

## 🛠️ Recent Improvements

### Object-Oriented Upload Architecture
- Implemented a `BaseUploader` abstract class with specific implementations for different content types
- Created concrete uploaders for articles, magazines, and events
- Improved code organization and maintainability

### Server-Side Upload API
- Created a secure `/api/upload` endpoint that handles file uploads through the server
- Implemented proper authentication and authorization checks
- Bypassed Supabase Row Level Security (RLS) restrictions using service key
- Added comprehensive error handling

### UI Enhancements
- Redesigned article detail page with two-column layout
- Added author information, related articles, and social sharing
- Implemented responsive design for all screen sizes
- Added newsletter signup components
- Enhanced events detail page to match article styling
- Improved dashboard interface with consistent styling

### Bug Fixes
- Fixed image display issues in article pages
- Corrected delete functionality in admin dashboard
- Ensured consistent styling across all pages
- Addressed mobile responsiveness issues

## 📝 Technical Debt & Known Issues

- Storage bucket for events needs proper RLS policies to ensure security
- Some lint warnings remain about unused variables and imports
- Newsletter functionality is only UI mockup, needs backend integration
- Mobile optimization for article detail page could be improved
- Error handling for failed image uploads needs more comprehensive approach
- Some delete buttons have inconsistent styling in admin interface
- Magazine delete page has import path issues that need fixing

## 💻 Technical Architecture

### Framework & Infrastructure
- **Next.js 14**: Framework for building the application
- **TypeScript**: For type safety and improved developer experience
- **Supabase**: Database, authentication, storage, and serverless functions
- **Tailwind CSS**: Utility-first CSS framework for styling

### Database Schema
- **users**: Managed by Supabase Auth
- **user_roles**: Maps users to roles (admin, editor, etc.)
- **magazines**: Magazine metadata with PDF and teaser image URLs
- **articles**: Article content, metadata, and image URLs
- **events**: Event information with dates, locations, etc.

### Storage Buckets
- **magazines-storage**: PDFs and teaser images for magazines
- **articles**: Images for article content
- **events**: Images for events

### Authentication & Authorization
- Supabase Auth for user authentication
- Custom role-based access control for admin features
- Server-side middleware to protect admin routes
- Secure API routes with proper permission checks

### File Upload System
- Object-oriented architecture with `BaseUploader` abstract class
- Specialized uploaders for different content types
- Server-side API with service key to bypass RLS
- Proper validation and error handling

## 🚀 Next Steps

### High Priority
1. **Fix Storage Permissions**: Configure proper RLS policies for storage buckets to ensure secure access
2. **Complete Delete Functionality**: Ensure all delete operations work correctly and have confirmation dialogs
3. **Fix Image Display Issues**: Address any remaining issues with image display in the events section
4. **Resolve Import Path Issues**: Fix the path issues in magazine delete page imports

### Medium Priority
1. **Implement Newsletter Functionality**: Create backend for newsletter signups
2. **Improve Mobile Experience**: Enhance mobile responsiveness throughout the application
3. **Add Content Search**: Implement search functionality for articles and events
4. **Analytics Integration**: Add visitor analytics tracking

### Low Priority
1. **User Profile Features**: Allow registered users to save favorite articles/events
2. **Comment System**: Add ability for users to comment on articles
3. **Social Media Integration**: Deeper integration with social platforms
4. **Content Recommendation Engine**: Suggest articles based on user preferences

## 🔧 Development Guide

### Environment Setup
Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `RESEND_API_KEY` (for email functionality)

### Running Locally
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Deployment
The application can be deployed to Vercel or any other Next.js compatible hosting platform.

## 📚 Additional Resources

### API Documentation
- Supabase API documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Next.js API documentation: [https://nextjs.org/docs](https://nextjs.org/docs)

### Design Resources
- Figma Designs: Available upon request
- Brand Guidelines: Follow Las Vegas themed color schemes (black, red, gold) with modern typography
