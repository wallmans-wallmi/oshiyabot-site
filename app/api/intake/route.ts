import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';

/**
 * Zod schema for intake request validation
 */
const IntakeRequestSchema = z.object({
  product_name: z
    .string()
    .min(1, 'product_name is required and must be a non-empty string')
    .trim(),
  store_key: z
    .string()
    .min(1, 'store_key is required and must be a non-empty string')
    .trim(),
  product_url: z
    .string()
    .url('product_url must be a valid URL')
    .trim(),
  target_type: z.enum(['target_price', 'percent_drop'], {
    errorMap: () => ({
      message: 'target_type must be either "target_price" or "percent_drop"',
    }),
  }),
  target_value: z
    .number({
      required_error: 'target_value is required',
      invalid_type_error: 'target_value must be a number',
    })
    .positive('target_value must be a positive number')
    .gt(0, 'target_value must be greater than 0'),
  phone_e164: z
    .string()
    .regex(
      /^\+\d{10,15}$/,
      'phone_e164 must match E.164 format (e.g., +1234567890)'
    )
    .trim(),
  whatsapp_consent: z
    .boolean({
      required_error: 'whatsapp_consent is required',
      invalid_type_error: 'whatsapp_consent must be a boolean',
    })
    .refine((val) => val === true, {
      message: 'whatsapp_consent must be true',
    }),
});

/**
 * POST /api/intake
 * Accepts product watch requests from Oshiya intake agent
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    // Validate request with Zod
    const validationResult = IntakeRequestSchema.safeParse(body);

    if (!validationResult.success) {
      // Format Zod errors into a user-friendly structure
      const errors = validationResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return NextResponse.json(
        {
          error: 'Validation failed',
          errors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured. Please set Supabase environment variables.' },
        { status: 500 }
      );
    }

    // Insert into Supabase Watch table
    const { error } = await supabase
      .from('Watch')
      .insert({
        product_name: validatedData.product_name,
        store_key: validatedData.store_key,
        product_url: validatedData.product_url,
        target_type: validatedData.target_type,
        target_value: validatedData.target_value,
        phone_e164: validatedData.phone_e164,
        whatsapp_consent: validatedData.whatsapp_consent,
        is_active: true,
        last_price: null,
        last_checked_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        {
          error: 'Failed to create watch entry',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Intake API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
