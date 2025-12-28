import React from 'react';
import { InlineInputs } from '../components/InlineInputs';
import { AccountPreviewCard } from '../components/AccountPreviewCard';

interface QuickReply {
  label: string;
  value: string;
}

export function createNameRequestMessage(
  onNameSubmit: (firstName: string) => void
): {
  id: number;
  type: 'assistant';
  contentJSX: React.ReactNode;
  content: string;
  timestamp: Date;
} {
  return {
    id: Date.now(),
    type: 'assistant',
    contentJSX: (
      <div>
        <p className="mb-1">רק שאדע איך לפנות אלייך בוואטסאפ –</p>
        <p className="mb-2">איך לקרוא לך?</p>
        <p className="text-xs text-gray-500 mb-2">רק שם פרטי 😊</p>
        <InlineInputs
          inputs={[
            { 
              id: 'firstName', 
              type: 'text', 
              placeholder: 'שם פרטי'
            }
          ]}
          submitLabel="סגור"
          onSubmit={(values) => {
            if (values.firstName?.trim()) {
              onNameSubmit(values.firstName.trim());
            }
          }}
        />
      </div>
    ),
    content: 'רק שאדע איך לפנות אלייך בוואטסאפ – איך לקרוא לך?\nרק שם פרטי 😊',
    timestamp: new Date(),
  };
}

export function createAccountSuggestionMessage(
  onReply: (value: string) => void
): {
  id: number;
  type: 'assistant';
  contentJSX: React.ReactNode;
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
} {
  return {
    id: Date.now(),
    type: 'assistant',
    contentJSX: (
      <div>
        <p className="mb-1">רוצה שיהיה לך אזור אישי באתר?</p>
        <p>ככה תוכלי לראות את כל המעקבים שלך, להוסיף מוצרים ולנהל הכל במקום אחד 😊</p>
      </div>
    ),
    content: 'רוצה שיהיה לך אזור אישי באתר?\nככה תוכלי לראות את כל המעקבים שלך, להוסיף מוצרים ולנהל הכל במקום אחד 😊',
    timestamp: new Date(),
    quickReplies: [
      { label: 'כן, ברור', value: 'create-account-yes' },
      { label: 'לא עכשיו', value: 'create-account-no' }
    ]
  };
}

export function createAccountCreatedMessage(
  onNavigate: () => void
): {
  id: number;
  type: 'assistant';
  contentJSX: React.ReactNode;
  content: string;
  timestamp: Date;
}[] {
  return [
    {
      id: Date.now(),
      type: 'assistant',
      contentJSX: (
        <div>
          <p className="mb-1">מעולה 🙌</p>
          <p className="mb-2">אין צורך בפרטים נוספים – החשבון נוצר על בסיס הוואטסאפ שלך.</p>
          <p className="text-xs text-gray-500">בהמשך תוכלי להתחבר עם אותו מספר, בלי סיסמאות.</p>
        </div>
      ),
      content: 'מעולה 🙌\nאין צורך בפרטים נוספים – החשבון נוצר על בסיס הוואטסאפ שלך.\nבהמשך תוכלי להתחבר עם אותו מספר, בלי סיסמאות.',
      timestamp: new Date(),
    },
    {
      id: Date.now() + 1,
      type: 'assistant',
      contentJSX: (
        <div>
          <p className="mb-2">זה האזור האישי שלך 👇</p>
          <AccountPreviewCard onNavigate={onNavigate} />
        </div>
      ),
      content: 'זה האזור האישי שלך 👇',
      timestamp: new Date(),
    }
  ];
}

export function createAccountDeclinedMessage(): {
  id: number;
  type: 'assistant';
  content: string;
  timestamp: Date;
} {
  return {
    id: Date.now(),
    type: 'assistant',
    content: 'סגור 😊\nאפשר תמיד ליצור אזור אישי אחר כך.\nזה מחכה לך בתפריט מתי שתרצי.',
    timestamp: new Date(),
  };
}

export function createNameConfirmationSequence(
  firstName: string,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>,
  isFirstTimeUser: boolean,
  onAccountSuggestion?: (value: string) => void
) {
  // User message with first name
  setMessages(prev => [...prev, {
    id: Date.now(),
    type: 'user',
    content: firstName,
    timestamp: new Date(),
  }]);

  // Confirmation message
  setTimeout(() => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        content: `מעולה, ${firstName} 🙌\nאני אשלח לך הודעה ברגע שיש משהו ששווה לעצור בשבילו.`,
        timestamp: new Date(),
      }]);
      setIsTyping(false);

      // Account suggestion for first-time users
      if (isFirstTimeUser && onAccountSuggestion) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            const accountSuggestion = createAccountSuggestionMessage(onAccountSuggestion);
            setMessages(prev => [...prev, accountSuggestion]);
            setIsTyping(false);
          }, 800);
        }, 1200);
      } else {
        // Continue with normal flow
        continueNormalFlow(setMessages, setIsTyping);
      }
    }, 800);
  }, 500);
}

function continueNormalFlow(
  setMessages: React.Dispatch<React.SetStateAction<any[]>>,
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>
) {
  setTimeout(() => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'assistant',
        content: 'ובינתיים, אם בא לך – אפשר לבדוק עוד מוצר 😉',
        timestamp: new Date(),
      }]);
      setIsTyping(false);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 3,
            type: 'assistant',
            contentJSX: (
              <span className="text-sm">
                אם יש לך שאלה פתוחה – אני כאן.
                <br />למשל:
                <br />• "מה באמת ההבדל בין הדגמים?"
                <br />• "שווה לחכות לגרסה הבאה?"
              </span>
            ),
            content: 'אם יש לך שאלה פתוחה – אני כאן.\nלמשל:\n• "מה באמת ההבדל בין הדגמים?"\n• "שווה לחכות לגרסה הבאה?"',
            timestamp: new Date(),
          }]);
          setIsTyping(false);
        }, 1000);
      }, 1200);
    }, 800);
  }, 1500);
}