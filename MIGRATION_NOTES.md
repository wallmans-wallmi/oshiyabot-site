# Migration Notes: Vite to Next.js

This document outlines the changes made to migrate from Vite + React to Next.js App Router.

## Completed Changes

### 1. Project Structure
- ✅ Created Next.js App Router structure (`app/` directory)
- ✅ Maintained existing component structure in `src/app/components/`
- ✅ Created API routes in `app/api/`
- ✅ Moved assets to `public/assets/`

### 2. Configuration Files
- ✅ Created `next.config.mjs`
- ✅ Created `tsconfig.json` with Next.js settings
- ✅ Updated `tailwind.config.ts` for Next.js
- ✅ Updated `postcss.config.mjs` for standard Tailwind CSS
- ✅ Updated `package.json` with Next.js scripts and dependencies

### 3. Asset Imports
- ✅ Copied all assets from `src/assets/` to `public/assets/`
- ✅ Updated all `figma:asset` imports to use public paths
- ✅ Files updated:
  - `src/app/App.tsx`
  - `src/app/components/AboutPage.tsx`
  - `src/app/components/HowPage.tsx`
  - `src/app/components/WhatPage.tsx`
  - `src/app/components/ContactPage.tsx`

### 4. AI Integration
- ✅ Created AI abstraction layer (`src/lib/ai/`)
  - `client.ts` - Interface and factory
  - `mock.ts` - Mock provider for development
  - `openai.ts` - OpenAI implementation
- ✅ Created API route (`app/api/chat/route.ts`)
- ✅ Environment variables setup (`.env.example`)

### 5. Type Definitions
- ✅ Created `src/lib/types/chat.ts` with shared types
- ✅ Created `src/lib/storage/chatStorage.ts` for localStorage utilities

### 6. Main Application
- ✅ Added `'use client'` directive to `App.tsx`
- ✅ Created `app/page.tsx` that dynamically imports App component
- ✅ Created `app/layout.tsx` with root layout and metadata

### 7. Styling
- ✅ Updated Tailwind CSS to v3 syntax (from v4)
- ✅ Maintained all custom CSS in `theme.css`
- ✅ Preserved all animations and accessibility styles

## Next Steps

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

This will install Next.js and update Tailwind CSS to v3.

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:
```env
OPENAI_API_KEY=your_key_here  # Optional, uses mock by default
NEXT_PUBLIC_AI_PROVIDER=mock  # or 'openai'
```

### 3. Test the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:
- ✅ Chat interface loads
- ✅ Messages display correctly
- ✅ Assets (images) load properly
- ✅ Guided flow works
- ✅ localStorage persistence works

### 4. Known Issues to Address

#### Tailwind CSS v4 to v3 Migration
The project originally used Tailwind CSS v4 syntax. We've migrated to v3 for Next.js compatibility. The `theme.css` file contains `@theme inline` which is v4 syntax - this will be ignored in v3, but the CSS variables in `:root` will still work.

If you want to use the Tailwind v4 theme features, you would need to:
1. Convert `@theme inline` definitions to `tailwind.config.ts`
2. Or wait for Next.js to support Tailwind v4

#### Component Imports
All component imports should continue to work. The `@/` alias is configured to point to `src/`.

#### localStorage Usage
The App component uses localStorage extensively. We've disabled SSR for the main page (`ssr: false` in dynamic import) to prevent hydration issues.

### 5. Future Improvements

1. **Route Migration**: Consider migrating from client-side routing (`currentPage` state) to Next.js routes for better SEO and URL management
2. **Server Components**: Identify components that could be server components for better performance
3. **Image Optimization**: Use Next.js `Image` component for asset images
4. **API Integration**: The chat API route is ready - just add your OpenAI key

## File Changes Summary

### New Files
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page
- `app/api/chat/route.ts` - Chat API endpoint
- `src/lib/ai/client.ts` - AI client interface
- `src/lib/ai/mock.ts` - Mock AI provider
- `src/lib/ai/openai.ts` - OpenAI provider
- `src/lib/types/chat.ts` - Type definitions
- `src/lib/storage/chatStorage.ts` - Storage utilities
- `src/lib/utils/assets.ts` - Asset path utilities
- `next.config.mjs` - Next.js config
- `tsconfig.json` - TypeScript config
- `.gitignore` - Git ignore file
- `MIGRATION_NOTES.md` - This file

### Modified Files
- `package.json` - Updated scripts and dependencies
- `tailwind.config.ts` - Updated for Next.js
- `postcss.config.mjs` - Updated for standard Tailwind
- `src/styles/tailwind.css` - Updated to v3 syntax
- `src/app/App.tsx` - Added 'use client', fixed asset imports
- `src/app/components/*.tsx` - Fixed asset imports (4 files)

### Unchanged (Preserved)
- All component logic and UI code
- All styling and theme definitions
- All business logic
- All utility functions

## Testing Checklist

- [ ] App loads without errors
- [ ] Chat interface displays correctly
- [ ] Messages send and receive
- [ ] Guided flow works
- [ ] AI responses work (mock or OpenAI)
- [ ] Images load correctly
- [ ] localStorage persistence works
- [ ] Mobile responsive design preserved
- [ ] All pages accessible
- [ ] Build completes successfully (`npm run build`)
