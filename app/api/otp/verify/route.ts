import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';

const VerifyOTPRequestSchema = z.object({
  phone_e164: z
    .string()
    .regex(/^\+972\d{8,9}$/, 'phone_e164 must be in E.164 format for Israel (+972XXXXXXXX)'),
  code: z.string().length(6, 'OTP code must be 6 digits'),
});

/**
 * POST /api/otp/verify
 * Verifies an OTP code
 * Note: Supabase Auth session creation is handled client-side after OTP verification
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

    const validationResult = VerifyOTPRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { phone_e164, code } = validationResult.data;

    // In development mode, accept the fixed OTP code without database check
    if (process.env.NODE_ENV === 'development') {
      if (code === '111111') {
        console.log(`🧪 Dev mode: OTP verified for ${phone_e164}`);
        
        // If Supabase is configured, try to delete the OTP record (optional)
        if (supabase) {
          try {
            await supabase
              .from('user_otps')
              .delete()
              .eq('phone_e164', phone_e164)
              .eq('code', code);
          } catch (dbError) {
            console.warn('Could not delete OTP from database (continuing):', dbError);
          }
        }

        return NextResponse.json(
          { 
            success: true, 
            message: 'OTP verified successfully',
            phone_e164,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Invalid OTP code' },
          { status: 400 }
        );
      }
    }

    // Production mode: Require Supabase
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Production mode: Verify OTP from database
    const { data: otpRecords, error: queryError } = await supabase
      .from('user_otps')
      .select('*')
      .eq('phone_e164', phone_e164)
      .eq('code', code)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('Error querying OTP:', queryError);
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      );
    }

    if (!otpRecords || otpRecords.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      );
    }

    // OTP is valid - mark OTP as used
    await supabase
      .from('user_otps')
      .delete()
      .eq('id', otpRecords[0].id);

    // Note: Supabase Auth session creation should be handled client-side
    // The client will call supabaseAuth.auth.signInWithPassword or signUp
    // after receiving success from this endpoint
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'OTP verified successfully',
        phone_e164,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
