# OSART Unified Store

Next.js monorepo combining the OSART storefront and backend services (Next.js Route Handlers) for a seamless Vercel deployment experience.

## Project Structure
- `/src/app/api`: Backend routes (Route Handlers).
- `/src/app/(shop)`: Frontend storefront routes.
- `/src/lib`: Shared utilities (Supabase client, business logic).

## Local Development
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (see `.env.example`).
4. Run the development server:
   ```bash
   npm run dev
   ```

## Vercel Deployment Checklist
1. **Connect Repository**: Point Vercel to this repository.
2. **Environment Variables**: Add the following in Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Required for admin/orders API)
3. **Build Command**: `npm run build`
4. **Output Directory**: `Default`

