/**
 * Database type definitions for Supabase tables
 */

/**
 * User OTP record for WhatsApp-based phone verification
 */
export interface UserOTP {
  id: string; // UUID
  phone_e164: string;
  code: string;
  expires_at: string; // ISO timestamp
  created_at: string; // ISO timestamp
}

/**
 * User OTP insert/update payload (without auto-generated fields)
 */
export interface UserOTPInsert {
  phone_e164: string;
  code: string;
  expires_at: string; // ISO timestamp
}

