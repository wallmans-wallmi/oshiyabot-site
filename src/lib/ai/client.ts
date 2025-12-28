/**
 * AI Client Interface
 * 
 * This abstraction allows switching between different AI providers
 * (OpenAI, Anthropic, mock, etc.) without changing the rest of the codebase.
 */

import { createMockClient } from './mock';
import { createOpenAIClient } from './openai';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIClient {
  /**
   * Send messages to the AI and get a response
   */
  chat(messages: AIMessage[], context?: Record<string, unknown>): Promise<string>;
}

/**
 * Create an AI client instance based on environment configuration
 */
export function createAIClient(): AIClient {
  const provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'mock';
  
  if (provider === 'openai') {
    return createOpenAIClient();
  }
  
  // Default to mock for development
  return createMockClient();
}
