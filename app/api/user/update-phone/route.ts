import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAuth } from '@/lib/supabase/client-auth';

const UpdatePhoneRequestSchema = z.object({
  phone_e164: z
    .string()
    .regex(/^\+972\d{8,9}$/, 'phone_e164 must be in E.164 format for Israel (+972XXXXXXXX)'),
});

/**
 * POST /api/user/update-phone
 * Updates the authenticated user's phone number in their profile
 */
export async function POST(request: NextRequest) {
  try {
    // In development mode, bypass auth check
    if (process.env.NODE_ENV === 'development' && !supabaseAuth) {
      console.log('🧪 Dev mode: Skipping auth check for phone update');
      
      // Parse and validate request body
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON payload' },
          { status: 400 }
        );
      }

      const validationResult = UpdatePhoneRequestSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            errors: validationResult.error.errors,
          },
          { status: 400 }
        );
      }

      // Return success in dev mode without actually updating
      return NextResponse.json(
        { 
          success: true, 
          message: 'Phone number updated successfully (dev mode)',
        },
        { status: 200 }
      );
    }

    // Production mode: Require auth
    if (!supabaseAuth) {
      return NextResponse.json(
        { error: 'Auth not configured' },
        { status: 500 }
      );
    }

    // Get the current session
    const {
      data: { session },
    } = await supabaseAuth.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const validationResult = UpdatePhoneRequestSchema.safeParse(body);

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

    // Update user metadata with new phone number
    const { error: updateError } = await supabaseAuth.auth.updateUser({
      data: {
        phone_e164,
      },
    });

    if (updateError) {
      console.error('Error updating user phone:', updateError);
      return NextResponse.json(
        { error: 'Failed to update phone number' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Phone number updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update phone error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

