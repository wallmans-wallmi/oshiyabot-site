# Oshiya

A mobile-first shopping assistant website with guided chat flow and AI-powered responses.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **OpenAI** integration (optional, can use mock)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:
```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration (optional - uses mock by default)
OPENAI_API_KEY=your_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# AI Provider (mock or openai)
NEXT_PUBLIC_AI_PROVIDER=mock

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── chat/         # Chat API endpoint
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (chat interface)
├── src/
│   ├── app/              # Main application code
│   │   ├── App.tsx       # Main app component (client-side)
│   │   ├── components/   # React components
│   │   └── utils/        # Utility functions
│   ├── lib/              # Shared libraries
│   │   ├── ai/           # AI client abstraction
│   │   │   ├── client.ts # AI client interface
│   │   │   ├── mock.ts   # Mock AI provider
│   │   │   └── openai.ts # OpenAI implementation
│   │   ├── storage/      # LocalStorage utilities
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   └── styles/           # Global styles
└── public/               # Static assets
    └── assets/           # Images and other assets
```

## Features

### Chat System

The chat system has two modes:

1. **Guided Flow**: Pre-defined conversation steps that guide users through the product tracking setup
2. **AI Mode**: OpenAI-powered responses for open-ended questions

The guided flow automatically transitions to AI mode when users ask questions outside the predefined options.

### Guided Flow Configuration

The guided flow is configured in `src/app/utils/conversationalFlow.ts`. It supports:
- Quick reply buttons
- Inline text inputs
- Image uploads
- Link pasting

### Switching from Mock to Real AI

1. Set `OPENAI_API_KEY` in `.env.local`
2. Set `NEXT_PUBLIC_AI_PROVIDER=openai` in `.env.local`
3. Restart the development server

The mock provider returns contextual responses based on keywords in Hebrew. The OpenAI provider uses GPT-4o-mini by default (configurable via `OPENAI_MODEL`).

## Mobile-First Design

The application is designed mobile-first with responsive breakpoints:
- Mobile: 360px, 390px (primary)
- Tablet: 768px
- Desktop: 1024px, 1440px

## Accessibility

The application includes:
- Keyboard navigation support
- Focus states
- ARIA labels
- Good contrast ratios
- Readable tap targets (minimum 44px on mobile)
- Accessibility menu for customizations

## Storage

Chat conversations are saved to localStorage for persistence across page refreshes. The storage utilities are in `src/lib/storage/chatStorage.ts`.

## Deployment to Render

This project is configured for deployment on [Render](https://render.com).

### Required Environment Variables

Set these in your Render dashboard:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep secret!)

### Render Configuration

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: 18.17.0+ (specified in `package.json`)

### Getting Supabase Credentials

1. Go to Supabase Dashboard → Settings → API
2. Copy **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **service_role key** (secret!) → use as `SUPABASE_SERVICE_ROLE_KEY`

### Database Setup

Ensure your Supabase database has a `Watch` table with columns:
- `id`, `product_name`, `store_key`, `product_url`, `target_type`, `target_value`
- `phone_e164`, `whatsapp_consent`, `is_active`, `last_price`, `last_checked_at`
- `created_at`, `updated_at`

**📖 See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for complete deployment guide**

## Development Notes

- The main `App.tsx` component is a client component due to extensive use of browser APIs (localStorage, window, etc.)
- Components are in `src/app/components/` to maintain the existing structure
- Assets are in `public/assets/` and referenced via absolute paths
- The app uses Hebrew (RTL) language support