import React from 'react';

export interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  contentJSX?: React.ReactNode;
  image?: string;
  quickReplies?: QuickReply[];
  inlineInputs?: InlineInput[];
  onInlineSubmit?: (values: Record<string, string>) => void;
  timestamp: Date;
}

export interface QuickReply {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface InlineInput {
  id: string;
  type: 'text' | 'number' | 'textarea';
  placeholder: string;
  value?: string;
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
  };
}

// Path 1: "כן, יש לי מוצר"
export function getHasProductFlow(
  step: number,
  onComplete: (message: Message) => void,
  onInlineSubmit: (values: Record<string, string>, nextStep: number) => void
): Message[] {
  const messages: Message[] = [];

  if (step === 1) {
    messages.push({
      id: Date.now(),
      type: 'assistant',
      content: 'מעולה! תעזרי לי לדייק כדי שאוכל לעקוב כמו שצריך –\nרק תעני מה שברור לך כרגע 😉',
      timestamp: new Date(),
    });

    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'מה הדגם או השם המלא של המוצר?\nואם יש לך לינק או תמונה שלו – תשלחי, זה הכי עוזר 🙌',
        timestamp: new Date(),
      };
      onComplete(msg);
    }, 800);
  }

  if (step === 2) {
    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 2,
        type: 'assistant',
        content: 'יש פרטים שחשובים לך?\nכמו גודל, צבע, נפח או גרסה מסוימת?',
        contentJSX: (
          <span>
            יש פרטים שחשובים לך?<br />
            כמו גודל, צבע, נפח או גרסה מסוימת?
            <br /><br />
            <span className="text-xs text-gray-500">גם פה – אם יש תמונה או צילום מסך שמסביר, זה סופר עוזר.</span>
          </span>
        ),
        inlineInputs: [
          { id: 'details', type: 'textarea', placeholder: 'למשל: 256GB, צבע שחור, או כל פרט רלוונטי...' }
        ],
        onInlineSubmit: (values) => onInlineSubmit(values, 3),
        timestamp: new Date(),
      };
      onComplete(msg);
    }, 1000);
  }

  if (step === 3) {
    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 3,
        type: 'assistant',
        content: 'רוצה להגדיר יעד מחיר?\nאו שפשוט תגידי לי בערך מתי זה נחשב בעינייך משתלם?',
        quickReplies: [
          { label: 'יש לי מחיר יעד', value: 'price-target' },
          { label: 'בערך, תכווני אותי', value: 'price-range' },
          { label: 'אין לי מושג – תני ברירת מחדל חכמה', value: 'price-auto' },
        ],
        timestamp: new Date(),
      };
      onComplete(msg);
    }, 1000);
  }

  if (step === 4) {
    // This step shows inline input based on previous choice
    // Handled separately in the main logic
  }

  if (step === 5) {
    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 5,
        type: 'assistant',
        content: 'לעקוב עכשיו?\nאו לחכות למבצעים גדולים כמו בלאק פריידי ושופינג IL?',
        quickReplies: [
          { label: 'לעקוב עכשיו', value: 'track-now' },
          { label: 'לחכות למבצעים גדולים', value: 'track-sales' },
        ],
        timestamp: new Date(),
      };
      onComplete(msg);
    }, 1000);
  }

  if (step === 6) {
    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 6,
        type: 'assistant',
        content: 'סבבה, פותחת לך מעקב 🙂\nאשלח וואטסאפ ברגע שיש באמת הזדמנות שווה.',
        timestamp: new Date(),
      };
      onComplete(msg);

      // AI moment hint after 1.5s
      setTimeout(() => {
        const aiMoment: Message = {
          id: Date.now() + 7,
          type: 'assistant',
          contentJSX: (
            <span>
              אם יש לך שאלה פתוחה – אני כאן.
              <br />למשל:
              <br />• "מה באמת ההבדל בין הדגמים?"
              <br />• "שווה לחכות לגרסה הבאה?"
            </span>
          ),
          content: 'אם יש לך שאלה פתוחה – אני כאן.\nלמשל:\n• "מה באמת ההבדל בין הדגמים?"\n• "שווה לחכות לגרסה הבאה?"',
          timestamp: new Date(),
        };
        onComplete(aiMoment);
      }, 1500);
    }, 800);
  }

  return messages;
}

// Path 2: "לא, אשמח לעזרה"
export function getNeedsHelpFlow(
  step: number,
  onComplete: (message: Message) => void,
  onInlineSubmit: (values: Record<string, string>, nextStep: number) => void
): Message[] {
  const messages: Message[] = [];

  if (step === 1) {
    messages.push({
      id: Date.now(),
      type: 'assistant',
      content: 'הכי מעניין!\nבואי נעזור לך להבין מה שווה לך לבדוק בכלל – ואז נתקדם למעקב.',
      timestamp: new Date(),
    });

    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'איזו קטגוריה מעניינת אותך?\n(למשל: טלפון, שואב אבק, מחשב, מוצר טיפוח...)',
        inlineInputs: [
          { id: 'category', type: 'text', placeholder: 'למשל: טלפון, מחשב נייד, אוזניות...' }
        ],
        onInlineSubmit: (values) => onInlineSubmit(values, 2),
        timestamp: new Date(),
      };
      onComplete(msg);
    }, 800);
  }

  if (step === 2) {
    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 2,
        type: 'assistant',
        content: 'מה חשוב לך שיהיה בו?\nמותג מסוים, עיצוב, ביצועים, מחיר, המלצות, מידה…',
        inlineInputs: [
          { id: 'requirements', type: 'textarea', placeholder: 'ספרי לי מה חשוב לך...' }
        ],
        onInlineSubmit: (values) => onInlineSubmit(values, 3),
        timestamp: new Date(),
      };
      onComplete(msg);
    }, 1000);
  }

  if (step === 3) {
    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 3,
        type: 'assistant',
        content: 'יש תקציב מסוים?\nאו טווח מחיר שלא בא לך לעבור אותו?',
        inlineInputs: [
          { id: 'budget', type: 'text', placeholder: 'למשל: עד 3000 ש״ח, או: בין 1500-2500' }
        ],
        onInlineSubmit: (values) => onInlineSubmit(values, 4),
        timestamp: new Date(),
      };
      onComplete(msg);
    }, 1000);
  }

  if (step === 4) {
    setTimeout(() => {
      const msg: Message = {
        id: Date.now() + 4,
        type: 'assistant',
        content: 'אם יש משהו שראית ואת מתלבטת לגביו –\nתשלחי לינק או תמונה, זה יכול לעזור לי להבין בדיוק מה את מחפשת.',
        timestamp: new Date(),
      };
      onComplete(msg);

      // Soft closing after 2s
      setTimeout(() => {
        const closingMsg: Message = {
          id: Date.now() + 5,
          type: 'assistant',
          content: 'מעולה. תני לזה רגע להתבשל 🙂\nברגע שיהיה משהו בעין – תקפיצי לי. אני פה ✌️',
          timestamp: new Date(),
        };
        onComplete(closingMsg);

        // AI moment hint
        setTimeout(() => {
          const aiMoment: Message = {
            id: Date.now() + 6,
            type: 'assistant',
            contentJSX: (
              <span>
                אם יש לך שאלה פתוחה – אני כאן.
                <br />למשל:
                <br />• "מה באמת ההבדל בין הדגמים?"
                <br />• "שווה לחכות לגרסה הבאה?"
              </span>
            ),
            content: 'אם יש לך שאלה פתוחה – אני כאן.\nלמשל:\n• "מה באמת ההבדל בין הדגמים?"\n• "שווה לחכות לגרסה הבאה?"',
            timestamp: new Date(),
          };
          onComplete(aiMoment);
        }, 1500);
      }, 2000);
    }, 1000);
  }

  return messages;
}
