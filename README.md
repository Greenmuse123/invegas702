InVegas702 Magazine Web Application
Overview
This is a modern, full-stack web application for managing and showcasing the InVegas702 magazine. It features a public-facing magazine viewer, article system, event listings, and a secure admin dashboard for managing content. The stack leverages Next.js (App Router), Supabase (database, authentication, storage), and Tailwind CSS for styling.

Tech Stack
Frontend: Next.js 14 (App Router, React Server/Client Components)
Styling: Tailwind CSS
Backend/Database: Supabase (PostgreSQL, Auth, Storage)
PDF Handling: PDF.js (via pdfjs-dist)
Deployment: Vercel (recommended)
Email: Resend (for newsletter)
State/Auth: Supabase Auth (with context via custom Providers)
Application Structure
CopyInsert
src/
  app/               # Next.js App Router pages and API routes
    magazines/       # Magazine grid, viewer, and dynamic routes
    admin/           # Admin dashboard and content management
    articles/        # Article listing and details
    events/          # Event listing and details
    api/             # API routes (admin, etc.)
  components/
    magazine/        # PDFThumbnail, MagazineGrid, PDFViewer, etc.
    ui/              # Reusable UI components
    ...              # Other sections, layouts, providers
  lib/               # Utility functions (auth, admin checks, etc.)
  models/            # Database models/types
  types/             # TypeScript types
public/              # Static assets
supabase/            # Supabase config, migrations, etc.
Core Features
Magazine Grid: Displays all published magazines. Each cover is generated from the first page of the PDF.
Magazine Viewer: Users can read the full PDF in-browser using a custom PDF.js viewer.
Admin Dashboard: Secure area for managing magazines, articles, events, and newsletter subscribers.
Article System: Blog-style articles with rich text, categories, and author info.
Events: List and manage upcoming events.
Newsletter: Signup and manage subscribers, send newsletters via Resend.
Supabase Usage
Database: Stores magazine, article, event, and user data.
Auth: Handles user authentication and admin roles.
Storage: Stores magazine PDF files and images.
Best Practice: Magazines’ PDFs are kept in a private bucket. Signed URLs are generated server-side for secure, time-limited access to the files (recommended for covers and viewer).
Policies:
SELECT (read) for magazines is public (for viewing covers).
INSERT/UPDATE/DELETE is restricted to authenticated/admin users.
PDF Cover Thumbnails (Best Practice)
Covers are generated using the first page of each magazine’s PDF.
Security: Use Supabase Storage signed URLs for private access. Generate these URLs server-side (in src/app/magazines/page.tsx or an API route) and pass them to the frontend for rendering covers and the viewer.
Component: PDFThumbnail renders the cover using PDF.js and the signed URL.
Environment Variables
CopyInsert
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key

## Automated Magazine Upload & Cover Generation

### How it Works

1. **Admin uploads a magazine PDF** via the admin dashboard (`/admin/magazines/new`).
2. The PDF is uploaded to Supabase Storage automatically.
3. The backend generates a PNG cover from the first page of the PDF and uploads it to Storage.
4. The magazine record is created in the database with both the `pdf_url` and `cover_image_url`.
5. The frontend displays the cover image throughout the app.

### How to Use (for Site Owner/Admin)

- Go to `/admin/magazines/new` while logged in as an admin.
- Fill out the form and select a PDF file.
- Submit. The UI will show progress for PDF upload and cover generation.
- On success, the magazine is available in the main magazine grid with its cover image.

### Requirements
- Your `.env.local` must include:
  - `NEXT_PUBLIC_SUPABASE_URL=...`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
  - `SUPABASE_SERVICE_KEY=...`
- The Supabase Storage bucket is named `magazines-storage`.
- The Supabase table `magazines` must have columns: `title`, `description`, `issue_number`, `pdf_url`, `cover_image_url`, `status`, `created_by`.
- Node.js server must have `sharp` and `pdf-lib` installed:
  ```bash
  npm install sharp pdf-lib
  ```

### Troubleshooting
- If cover generation fails, check that your server can run `sharp` and that the uploaded PDF is valid.
- If environment variables are missing, the admin upload will not work.
- Only admins can upload magazines.

### Security
- Never commit `.env.local` with your Supabase service key to version control.
- The `SUPABASE_SERVICE_KEY` is required for backend cover generation and must NOT be exposed to the frontend.

---

## Developer Notes

- The cover generation is handled by the API route: `src/app/api/admin/generate-cover/route.ts`
- The admin upload UI is in: `src/app/admin/magazines/new/page.tsx`
- All uploads go to the `magazines-storage` bucket. Covers are stored under `covers/`.

---

Getting Started
Clone the repository.
Install dependencies: npm install
Set up your .env.local with Supabase and Resend keys.
Run the dev server: npm run dev
Access the site at http://localhost:3000
How to Update for Secure PDF Covers
Keep your Supabase Storage bucket private.
When fetching magazine data server-side, generate a signed URL for each PDF using Supabase’s createSignedUrl method.
Pass the signed URL to the frontend (to PDFThumbnail and PDFViewer).
Never expose the direct storage path or allow unauthenticated uploads.
Maintenance & Future Updates
Update Supabase policies as needed for new features.
Use signed URLs for all private asset access.
Extend the admin dashboard for new content types.
Keep dependencies up to date and review security best practices.
Contact
For questions or support, contact the InVegas702 team.