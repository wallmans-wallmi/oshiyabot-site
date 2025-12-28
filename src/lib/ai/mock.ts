/**
 * Mock AI Client
 * 
 * Provides mock responses for development and testing.
 * Returns contextual responses based on the user's message.
 */

import { AIClient, AIMessage } from './client';

class MockAIClient implements AIClient {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async chat(messages: AIMessage[], _context?: Record<string, unknown>): Promise<string> {
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    
    if (!lastMessage || lastMessage.role !== 'user') {
      return 'אני כאן לעזור! איך אני יכול לסייע?';
    }

    const userMessage = lastMessage.content.toLowerCase();

    // Simple keyword-based responses (Hebrew)
    if (userMessage.includes('מחיר') || userMessage.includes('כמה')) {
      return 'אני בודק עבורך את המחירים העדכניים בשוק. בדרך כלל אני יכול להמליץ על טווח מחיר מציאותי לפי הקטגוריה והדגם. יש לך דגם ספציפי בראש?';
    }

    if (userMessage.includes('הבדל') || userMessage.includes('מה ההבדל')) {
      return 'ההבדלים בין הדגמים יכולים להיות משמעותיים. בדרך כלל מדובר בביצועים, איכות, תכונות, וצריכת אנרגיה. איזה דגמים את משווה?';
    }

    if (userMessage.includes('מומלץ') || userMessage.includes('מה טוב')) {
      return 'ההמלצה שלי תלויה בצרכים שלך ובתקציב. אם תספרי לי מה חשוב לך - אני יכול להתאים המלצה מדויקת יותר. מה הקטגוריה שמעניינת אותך?';
    }

    if (userMessage.includes('מתי') || userMessage.includes('מתי לקנות')) {
      return 'זמני הקנייה האידיאליים משתנים לפי הקטגוריה. למשל, טכנולוגיה נוטה להיות זולה יותר לפני השקת דגמים חדשים. יש לך מוצר ספציפי שאת שוקלת?';
    }

    // Default response
    return 'זה נושא מעניין! אני כאן כדי לעזור לך להבין ולהחליט. תני לי פרטים נוספים ונוכל להתקדם יחד. מה הכי חשוב לך לדעת?';
  }
}

export function createMockClient(): AIClient {
  return new MockAIClient();
}
