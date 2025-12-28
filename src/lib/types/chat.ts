import { ReactNode } from 'react';

export interface Message {
  id: number | string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  contentJSX?: ReactNode;
  image?: string;
  quickReplies?: QuickReply[];
  inlineInputs?: InlineInput[];
  onInlineSubmit?: (values: Record<string, string>) => void;
  timestamp: Date;
  showAfterDelay?: number;
  metadata?: Record<string, unknown>;
}

export interface QuickReply {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface InlineInput {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'tel';
  placeholder: string;
  value?: string;
  inputMode?: 'text' | 'numeric' | 'tel';
}

export interface ConversationState {
  path: 'initial' | 'has-product' | 'needs-help';
  step: number;
  productData: {
    name?: string;
    link?: string;
    image?: string;
    details?: string;
    priceTarget?: string;
    timing?: string;
    category?: string;
    requirements?: string;
    budget?: string;
    phone?: string;
    firstName?: string;
  };
}

export interface ChatSession {
  messages: Message[];
  currentStep: number;
  conversationState: ConversationState;
  userProfile?: {
    firstName?: string;
    phone?: string;
  };
  subscriptionStatus?: 'free' | 'premium';
}
