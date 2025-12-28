# Render Deployment Guide for Oshiya

This guide will help you deploy your Next.js app to Render with Supabase integration.

## Prerequisites

1. A [Render](https://render.com) account
2. A [Supabase](https://supabase.com) project
3. Your Supabase credentials (Project URL and Service Role Key)

## Step 1: Prepare Your Supabase Database

Ensure your Supabase database has a `Watch` table with the following schema:

```sql
CREATE TABLE "Watch" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  store_key text NOT NULL,
  product_url text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('target_price', 'percent_drop')),
  target_value numeric NOT NULL,
  phone_e164 text NOT NULL,
  whatsapp_consent boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  last_price numeric,
  last_checked_at timestamp,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
```

## Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **service_role key** (Keep this secret! It's under "Project API keys")

## Step 3: Create a New Web Service on Render

1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

### Basic Settings
- **Name**: `oshiya` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose the closest region to your users
- **Branch**: `main` (or your default branch)

### Build & Deploy Settings
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18.17.0` or higher (specified in `package.json`)

## Step 4: Set Environment Variables

In the Render dashboard, go to **Environment** tab and add:

### Required Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (your service role key)
```

### Optional Variables (for AI features)

```
OPENAI_API_KEY=sk-... (if using OpenAI)
NEXT_PUBLIC_AI_PROVIDER=openai (or 'mock' for development)
OPENAI_MODEL=gpt-4o-mini
```

### Production App URL (set after first deploy)

```
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
```

**⚠️ Important**: 
- Never commit `.env.local` to Git
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - keep it secret!
- `NEXT_PUBLIC_*` variables are exposed to the browser

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Start the server (`npm start`)
3. Monitor the build logs for any errors

## Step 6: Verify Deployment

1. Once deployed, click on your service URL
2. Test the `/api/intake` endpoint (if you have a test client)
3. Check Render logs for any runtime errors
4. Verify Supabase connection by checking your database

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Solution: Make sure all required env vars are set in Render dashboard
- Check build logs to see which variable is missing

**Error: TypeScript compilation errors**
- Solution: Run `npx tsc --noEmit` locally to fix type errors before deploying

### Runtime Errors

**Error: "Missing env.NEXT_PUBLIC_SUPABASE_URL"**
- Solution: Check that `NEXT_PUBLIC_SUPABASE_URL` is set in Render environment variables

**Error: "Missing env.SUPABASE_SERVICE_ROLE_KEY"**
- Solution: Check that `SUPABASE_SERVICE_ROLE_KEY` is set (it's a secret, so it won't show in logs)

**Error: Database connection failed**
- Solution: Verify your Supabase credentials are correct
- Check Supabase dashboard to ensure your project is active
- Verify the `Watch` table exists with the correct schema

**Error: Supabase insert error**
- Solution: Check the table schema matches the expected format
- Verify RLS policies allow inserts (or that service role key is working)

### Performance Issues

**Slow cold starts**
- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to a paid plan for always-on instances

**Build timeouts**
- Render free tier has build time limits
- Optimize your build: remove unused dependencies, enable build caching

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Your Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Supabase service role key (secret) | `eyJhbGc...` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ No | Supabase anon key (if using client-side) | `eyJhbGc...` |
| `OPENAI_API_KEY` | ❌ No | OpenAI API key for AI features | `sk-...` |
| `OPENAI_BASE_URL` | ❌ No | OpenAI API base URL | `https://api.openai.com/v1` |
| `OPENAI_MODEL` | ❌ No | OpenAI model to use | `gpt-4o-mini` |
| `NEXT_PUBLIC_AI_PROVIDER` | ❌ No | AI provider: `mock` or `openai` | `mock` |
| `NEXT_PUBLIC_APP_URL` | ❌ No | Your app URL (for production) | `https://app.onrender.com` |

## Next Steps After Deployment

1. **Set up a custom domain** (optional): Configure DNS in Render dashboard
2. **Enable HTTPS**: Render provides free SSL certificates automatically
3. **Monitor logs**: Check Render logs regularly for errors
4. **Set up alerts**: Configure email alerts for failed deployments
5. **Database backups**: Ensure Supabase backups are configured

## Security Best Practices

1. ✅ Never commit `.env.local` or environment secrets to Git
2. ✅ Use service role key only in API routes (server-side)
3. ✅ Consider using Supabase RLS policies for additional security
4. ✅ Regularly rotate your Supabase service role key
5. ✅ Monitor your Supabase usage and set up billing alerts

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase PostgREST API](https://supabase.com/docs/guides/api)

