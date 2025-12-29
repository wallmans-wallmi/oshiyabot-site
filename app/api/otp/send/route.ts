import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';

const SendOTPRequestSchema = z.object({
  phone_e164: z
    .string()
    .regex(/^\+972\d{8,9}$/, 'phone_e164 must be in E.164 format for Israel (+972XXXXXXXX)'),
});

/**
 * POST /api/otp/send
 * Sends an OTP code to the provided WhatsApp number
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body first
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const validationResult = SendOTPRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { phone_e164 } = validationResult.data;

    // In development mode, use a fixed OTP code for testing (even without Supabase)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧪 Dev mode: OTP for ${phone_e164}: 111111`);

      // If Supabase is configured, store it in the database
      if (supabase) {
        try {
          const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
          const { error: insertError } = await supabase
            .from('user_otps')
            .insert({
              phone_e164,
              code: '111111',
              expires_at: expiresAt.toISOString(),
            });

          if (insertError) {
            console.error('Error storing OTP in database:', insertError);
            // Continue anyway - we'll still return success in dev mode
          }
        } catch (dbError) {
          console.error('Database error (continuing in dev mode):', dbError);
          // Continue anyway - we'll still return success in dev mode
        }
      } else {
        console.warn('⚠️ Supabase not configured - OTP will work but won\'t be stored in DB');
      }

      return NextResponse.json(
        { success: true, message: 'OTP sent successfully' },
        { status: 200 }
      );
    }

    // Production mode: Require Supabase
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Production mode: Generate random OTP and send via Twilio
    // TODO: Replace with Twilio send logic when ready
    return NextResponse.json(
      { error: 'Twilio not yet connected' },
      { status: 500 }
    );
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

