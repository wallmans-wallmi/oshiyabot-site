# Supabase Migrations

This directory contains SQL migration files for the Oshiya database schema.

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended for Quick Setup)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file
4. Paste and run the SQL in the editor

### Option 2: Supabase CLI (For Local Development)

If you have Supabase CLI installed:

```bash
# Apply migrations
supabase db push

# Or apply a specific migration
supabase db reset
```

### Option 3: Direct SQL Execution

You can run the SQL files directly in any PostgreSQL client connected to your Supabase database.

## Migration Files

- `001_create_user_otps_table.sql` - Creates the `user_otps` table for WhatsApp OTP verification

## Notes

- All timestamps use `TIMESTAMP WITH TIME ZONE` to ensure proper timezone handling
- Indexes are created for performance on frequently queried columns (`phone_e164`, `expires_at`)
- The `id` column uses `gen_random_uuid()` as the default for UUID generation

