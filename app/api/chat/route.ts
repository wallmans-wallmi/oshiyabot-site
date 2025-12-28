import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Zod schema for chat request validation
 */
const ChatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system'], {
          errorMap: () => ({
            message: 'role must be either "user", "assistant", or "system"',
          }),
        }),
        content: z
          .string()
          .min(1, 'content must be a non-empty string'),
      })
    )
    .min(1, 'messages must be a non-empty array'),
});

/**
 * POST /api/chat
 * Handles chat requests using OpenAI Chat API
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
    const validationResult = ChatRequestSchema.safeParse(body);

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

    const { messages } = validationResult.data;

    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        {
          error: 'OpenAI API key is not configured',
        },
        { status: 500 }
      );
    }

    // Call OpenAI Chat API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Unknown error from OpenAI API',
      }));

      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        {
          error: 'Failed to get response from OpenAI',
          details: errorData.error?.message || 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Return the full OpenAI response
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
