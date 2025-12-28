/**
 * Chat storage utilities for localStorage
 * 
 * Handles saving and loading chat state from localStorage
 */

import { Message, ConversationState, ChatSession } from '@/lib/types/chat';

const STORAGE_KEYS = {
  messages: 'oshiya-messages',
  conversationState: 'oshiya-conversation-state',
  loggedIn: 'oshiya-logged-in',
  chatSession: 'oshiya-chat-session',
} as const;

/**
 * Save messages to localStorage
 */
export function saveMessages(messages: Message[]): void {
  if (typeof window === 'undefined') return;
  
  // Remove contentJSX before saving (it contains React elements that can't be serialized)
  const messagesForStorage = messages.map(msg => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contentJSX: _contentJSX, ...rest } = msg;
    return rest;
  });
  
  try {
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messagesForStorage));
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
}

/**
 * Load messages from localStorage
 */
export function loadMessages(): Message[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.messages);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved) as Array<Omit<Message, 'timestamp'> & { timestamp: string }>;
    // Restore messages with Date objects
    return parsed.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    })) as Message[];
  } catch (error) {
    console.error('Failed to load messages:', error);
    return null;
  }
}

/**
 * Save conversation state to localStorage
 */
export function saveConversationState(state: ConversationState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.conversationState, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save conversation state:', error);
  }
}

/**
 * Load conversation state from localStorage
 */
export function loadConversationState(): ConversationState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.conversationState);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to load conversation state:', error);
    return null;
  }
}

/**
 * Save login state to localStorage
 */
export function saveLoginState(isLoggedIn: boolean): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.loggedIn, isLoggedIn ? 'true' : 'false');
  } catch (error) {
    console.error('Failed to save login state:', error);
  }
}

/**
 * Load login state from localStorage
 */
export function loadLoginState(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(STORAGE_KEYS.loggedIn) === 'true';
  } catch (error) {
    console.error('Failed to load login state:', error);
    return false;
  }
}

/**
 * Save complete chat session to localStorage
 */
export function saveChatSession(session: ChatSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Remove contentJSX before saving
    const sessionForStorage = {
      ...session,
      messages: session.messages.map(msg => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { contentJSX, ...rest } = msg;
        return rest;
      }),
    };
    localStorage.setItem(STORAGE_KEYS.chatSession, JSON.stringify(sessionForStorage));
  } catch (error) {
    console.error('Failed to save chat session:', error);
  }
}

/**
 * Load complete chat session from localStorage
 */
export function loadChatSession(): ChatSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.chatSession);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved) as Omit<ChatSession, 'messages'> & { messages: Array<Omit<Message, 'timestamp'> & { timestamp: string }> };
    // Restore messages with Date objects
    return {
      ...parsed,
      messages: parsed.messages.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })) as Message[],
    } as ChatSession;
  } catch (error) {
    console.error('Failed to load chat session:', error);
    return null;
  }
}
