/**
 * Gender-aware phrasing utilities for Hebrew language
 * 
 * Provides functions to generate gender-appropriate Hebrew phrases
 * based on user's gender selection (male, female, or neutral).
 */

export type Gender = 'male' | 'female' | null;

/**
 * Gender-aware phrasing options
 */
interface PhrasingOptions {
  masculine: string;
  feminine: string;
  neutral: string;
}

/**
 * Get gender-appropriate phrasing based on user's gender
 * 
 * @param gender - User's gender: 'male', 'female', or null (neutral)
 * @param options - Object with masculine, feminine, and neutral phrasing options
 * @returns The appropriate phrasing string
 * 
 * @example
 * getGenderPhrasing('male', {
 *   masculine: 'ברוך הבא',
 *   feminine: 'ברוכה הבאה',
 *   neutral: 'שלום וברכה'
 * }) // Returns: 'ברוך הבא'
 */
export function getGenderPhrasing(gender: Gender, options: PhrasingOptions): string {
  if (gender === 'male') {
    return options.masculine;
  }
  if (gender === 'female') {
    return options.feminine;
  }
  return options.neutral;
}

/**
 * Common gender-aware phrases for Oshiya chat agent
 */
export const GenderPhrases = {
  /**
   * Welcome greetings
   */
  welcome: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'ברוך הבא',
    feminine: 'ברוכה הבאה',
    neutral: 'שלום וברכה',
  }),

  /**
   * "Let's get started" / "Let's begin"
   */
  letsStart: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'בוא נתחיל',
    feminine: 'בואי נתחיל',
    neutral: 'בואו נתחיל',
  }),

  /**
   * "I can help you"
   */
  iCanHelp: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'אני יכול לעזור לך',
    feminine: 'אני יכולה לעזור לך',
    neutral: 'אני יכולה לעזור',
  }),

  /**
   * "Tell me" / "Share with me"
   */
  tellMe: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'ספר לי',
    feminine: 'ספרי לי',
    neutral: 'ספרו לי',
  }),

  /**
   * "What are you looking for?"
   */
  whatAreYouLookingFor: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'מה אתה מחפש?',
    feminine: 'מה את מחפשת?',
    neutral: 'מה אתם מחפשים?',
  }),

  /**
   * "You can" (suggestion/instruction)
   */
  youCan: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'אתה יכול',
    feminine: 'את יכולה',
    neutral: 'אפשר',
  }),

  /**
   * "I understand" / "I see"
   */
  iUnderstand: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'אני מבין',
    feminine: 'אני מבינה',
    neutral: 'אני מבינה',
  }),

  /**
   * "You chose" / "You selected"
   */
  youChose: (gender: Gender): string => getGenderPhrasing(gender, {
    masculine: 'בחרת',
    feminine: 'בחרת',
    neutral: 'נבחר',
  }),
} as const;

/**
 * Build a gender-aware system prompt for the AI chat agent
 * 
 * @param gender - User's gender
 * @param basePrompt - Base system prompt without gender-specific phrasing
 * @returns Complete system prompt with gender-aware instructions
 */
export function buildGenderAwareSystemPrompt(gender: Gender, basePrompt: string): string {
  const addressInstruction = gender === 'male' 
    ? 'פנה למשתמש בלשון זכר (אתה, בחרת, מחפש וכו\').'
    : gender === 'female'
    ? 'פנה למשתמש בלשון נקבה (את, בחרת, מחפשת וכו\').'
    : 'פנה למשתמש בלשון ניטרלית או בלשון רבים (אפשר, ניתן, אתם וכו\'). הימנע משימוש בנקודות, קווים נטויים או סוגריים.';
  
  return `${basePrompt}\n\nהוראה חשובה: ${addressInstruction}`;
}

