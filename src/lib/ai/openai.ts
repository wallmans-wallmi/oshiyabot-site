/**
 * OpenAI Client Implementation
 * 
 * Requires OPENAI_API_KEY environment variable to be set.
 */

import { AIClient, AIMessage } from './client';

class OpenAIClient implements AIClient {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    if (!this.apiKey) {
      console.warn('OPENAI_API_KEY not set. OpenAI client will not work properly.');
    }
  }

  async chat(messages: AIMessage[], context?: Record<string, unknown>): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is not configured. Please set it in your environment variables.');
    }

    // Convert messages to OpenAI format
    const openAIMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
      content: msg.content,
    }));

    // Add system context if provided
    if (context) {
      const systemMessage = {
        role: 'system' as const,
        content: `You are Oshiya, a helpful shopping assistant. Context: ${JSON.stringify(context)}`,
      };
      openAIMessages.unshift(systemMessage);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: openAIMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'לא הצלחתי לקבל תשובה. נסי שוב.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

export function createOpenAIClient(): AIClient {
  return new OpenAIClient();
}
