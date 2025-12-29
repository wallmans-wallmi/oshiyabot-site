-- Create user_otps table for WhatsApp OTP verification
-- This table stores OTP codes sent to users for phone verification

CREATE TABLE IF NOT EXISTS user_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164 TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on phone_e164 for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_otps_phone_e164 ON user_otps(phone_e164);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_user_otps_expires_at ON user_otps(expires_at);

-- Add comment to table
COMMENT ON TABLE user_otps IS 'Stores OTP codes for WhatsApp-based phone verification';

-- Add comments to columns
COMMENT ON COLUMN user_otps.id IS 'Unique identifier for the OTP record';
COMMENT ON COLUMN user_otps.phone_e164 IS 'Phone number in E.164 format (e.g., +14155238886)';
COMMENT ON COLUMN user_otps.code IS 'The OTP verification code (typically 6 digits)';
COMMENT ON COLUMN user_otps.expires_at IS 'Timestamp when the OTP code expires';
COMMENT ON COLUMN user_otps.created_at IS 'Timestamp when the OTP record was created';

