# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key if you want to use real AI (otherwise mock is used by default):
   ```env
   OPENAI_API_KEY=your_key_here
   NEXT_PUBLIC_AI_PROVIDER=openai  # or 'mock' for development
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## Switching from Mock to OpenAI

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Add it to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   NEXT_PUBLIC_AI_PROVIDER=openai
   ```
3. Restart the dev server

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `src/app/` - Main application code (components, utils)
- `src/lib/` - Shared libraries (AI clients, types, utilities)
- `public/assets/` - Static assets (images)
- `src/styles/` - Global styles and Tailwind CSS

## Features

✅ **Guided Chat Flow**: Pre-defined conversation steps for product tracking setup  
✅ **AI Mode**: OpenAI integration ready (mock by default)  
✅ **Mobile-First**: Responsive design preserved  
✅ **LocalStorage**: Conversation state persists across refreshes  
✅ **Accessibility**: Full keyboard navigation, ARIA labels, focus states

## Troubleshooting

### Build Errors
If you see TypeScript errors after installing dependencies, run:
```bash
npm run build
```
This will show any type errors that need to be fixed.

### Assets Not Loading
Ensure assets are in `public/assets/` and referenced with paths like `/assets/filename.png`.

### OpenAI Not Working
1. Check that `OPENAI_API_KEY` is set in `.env.local`
2. Verify `NEXT_PUBLIC_AI_PROVIDER=openai` is set
3. Check browser console and server logs for errors
4. Ensure your OpenAI account has credits

### Styling Issues
If styles look broken:
1. Verify Tailwind CSS is processing correctly
2. Check that `src/styles/index.css` is imported in `app/layout.tsx`
3. Ensure PostCSS and Tailwind are installed
