'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Tag, Send, TrendingDown, Bell, Info, Menu, X, Image as ImageIcon, ExternalLink, MessageCircle, Settings, EllipsisVertical, Pause, Trash2, Pencil, ChevronDown, User, Eye, Shield, Cookie, Scale } from 'lucide-react';
const oshiyaAvatar = "/assets/ea9d3f873ca76c584ffa18ac5550589db242a0e0.png";
import { AboutPage } from './components/AboutPage';
import { WhatPage } from './components/WhatPage';
import { HowPage } from './components/HowPage';
import { CookieConsent } from './components/CookieConsent';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { AccessibilityPage } from './components/AccessibilityPage';
import { AccessibilityStatementPage } from './components/AccessibilityStatementPage';
import { ContactPage } from './components/ContactPage';
import { ProfilePage } from './components/ProfilePage';
import { TrackingsPage } from './components/TrackingsPage';
import { AccessibilityButton } from './components/AccessibilityButton';
import { AccessibilityMenu } from './components/AccessibilityMenu';
import { ImageUploaderDemo } from './components/ImageUploaderDemo';
import { InlineInputs } from './components/InlineInputs';
import { createNameRequestMessage, createNameConfirmationSequence, createAccountCreatedMessage, createAccountDeclinedMessage } from './utils/nameRequestFlow';
import { LoginPage } from './components/LoginPage';
import { OTPVerification } from './components/OTPVerification';
import { AccountPage } from './components/AccountPage';
import { SettingsPage } from './components/SettingsPage';
import { ResponsivePageWrapper } from './components/ResponsivePageWrapper';
import { UIFoundationsPage } from './components/UIFoundationsPage';
import { ChatScrollToLatestButton } from './components/ChatScrollToLatestButton';
import { PaymentPage } from './components/PaymentPage';
import { PremiumSelectionPage } from './components/PremiumSelectionPage';

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  contentJSX?: React.ReactNode;
  image?: string;
  quickReplies?: QuickReply[];
  inlineInputs?: InlineInput[];
  timestamp: Date;
  showAfterDelay?: number;
  source?: 'script' | 'ai' | 'user'; // Distinguish between scripted, AI-generated, and user messages
}

interface QuickReply {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface InlineInput {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'tel';
  placeholder: string;
  value?: string;
  inputMode?: 'text' | 'numeric' | 'tel';
}

interface ConversationState {
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
    target_type?: 'target_price' | 'percent_drop';
    target_value?: number;
  };
}

export interface Deal {
  id: number;
  productName: string;
  storeName: string;
  currentPrice: number;
  previousPrice: number;
  dropPercentage: number;
  productUrl: string;
  timestamp: Date;
  isRead: boolean;
  priceAtSend: number;
  sentAt: Date;
  lastCheckedAt: Date;
  status: 'active' | 'paused' | 'expired';
  priceTarget: number; // Target price user wants to reach (required for TrackingsPage)
  startingPrice?: number; // Price when tracking started
  expirationReason?: string; // Reason why tracking expired (system-initiated only)
  pausedAt?: Date; // When user paused the tracking
  startDate: Date; // Date when tracking started (required for TrackingsPage)
  imageUrl?: string; // Optional image URL for the product (used by TrackingsPage)
}

export default function App() {
  const [message, setMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'deals'>('chat');
  const [isTabsCollapsed, setIsTabsCollapsed] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    path: 'initial',
    step: 0,
    productData: {},
  });
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 1,
      productName: 'AirPods Pro (דור 2)',
      storeName: 'iDigital',
      currentPrice: 899,
      previousPrice: 1059,
      dropPercentage: 15,
      productUrl: 'https://example.com',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      priceAtSend: 899,
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastCheckedAt: new Date(Date.now() - 15 * 60 * 1000),
      status: 'active',
      priceTarget: 850,
      startingPrice: 1059,
      startDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      productName: 'MacBook Air M2',
      storeName: 'KSP',
      currentPrice: 4499,
      previousPrice: 4899,
      dropPercentage: 12,
      productUrl: 'https://example.com',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false,
      priceAtSend: 4299,
      sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastCheckedAt: new Date(Date.now() - 45 * 60 * 1000),
      status: 'expired',
      priceTarget: 4200,
      startingPrice: 4899,
      expirationReason: 'לא הייתה ירידת מחיר משמעותית כבר 30 ימים',
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      productName: 'Samsung Galaxy S24',
      storeName: 'Bug',
      currentPrice: 2899,
      previousPrice: 3299,
      dropPercentage: 12,
      productUrl: 'https://example.com',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
      priceAtSend: 2899,
      sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      lastCheckedAt: new Date(Date.now() - 8 * 60 * 1000),
      status: 'paused',
      startingPrice: 3299,
      priceTarget: 2700,
      pausedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      startDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 4,
      productName: 'AirPods Pro 2',
      storeName: 'iDigital',
      currentPrice: 899,
      previousPrice: 999,
      dropPercentage: 10,
      productUrl: 'https://example.com',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      isRead: false,
      priceAtSend: 899,
      sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastCheckedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'expired',
      priceTarget: 750,
      startingPrice: 999,
      expirationReason: 'המוצר לא זמין כרגע בחנויות שאנחנו עוקבים אחריהן',
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: 5,
      productName: 'Sony WH-1000XM5',
      storeName: 'KSP',
      currentPrice: 1299,
      previousPrice: 1399,
      dropPercentage: 7,
      productUrl: 'https://example.com',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      isRead: false,
      priceAtSend: 1299,
      sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      lastCheckedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'expired',
      priceTarget: 900,
      startingPrice: 1399,
      expirationReason: 'יעד המחיר שהוגדר כבר לא תואם את מחירי השוק',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
  ]);
  const [messages, setMessages] = useState<Message[]>(() => {
    // Check if this is a first-time user using the specific flag
    const isFirstVisit = localStorage.getItem('oshiyafirstvisit') === null;
    
    // First scripted message (only for first-time users)
    const welcomeMessage: Message = {
      id: 1,
      type: 'assistant',
      content: 'היי 👋 אני אושייה, המלווה האישית שלך לעקוב אחרי מוצרים שאת בוחרת!',
      source: 'script',
      timestamp: new Date(),
    };

    // Second scripted message with choice buttons (always shown)
    const mainQuestion: Message = {
      id: 2,
      type: 'assistant',
      content: 'מה בא לך לבדוק? יש לך מוצר ספציפי בראש?',
      source: 'script',
      quickReplies: [
        { label: 'כן, יש לי מוצר', value: 'has-specific-product' },
        { label: 'לא ממש, אשמח לעזרה', value: 'needs-help-choosing' },
      ],
      timestamp: new Date(),
    };

    // Return welcome + question for first-time users, only question for returning users
    return isFirstVisit ? [welcomeMessage, mainQuestion] : [mainQuestion];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isMenuOpening, setIsMenuOpening] = useState(false);
  type PageType = 'chat' | 'about' | 'what' | 'how' | 'privacy' | 'terms' | 'demo' | 'accessibility' | 'accessibility-statement' | 'contact' | 'login' | 'otp' | 'account' | 'profile' | 'trackings' | 'settings' | 'payment' | 'premium-selection' | 'ui-foundations';
  const [currentPage, setCurrentPage] = useState<PageType>('chat');
  const [selectedPremiumPlan, setSelectedPremiumPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [dealsFilter, setDealsFilter] = useState<'active' | 'expired' | 'all'>('active');
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeOverflowMenu, setActiveOverflowMenu] = useState<number | null>(null);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState<number | null>(null);
  const [showRestoreSheet, setShowRestoreSheet] = useState<number | null>(null);
  const [showPauseConfirmation, setShowPauseConfirmation] = useState<number | null>(null);
  const [showEditPriceTarget, setShowEditPriceTarget] = useState<number | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [premiumStartDate, setPremiumStartDate] = useState<Date | null>(null);
  const [newPriceTarget, setNewPriceTarget] = useState<string>('');
  const [recentlyUpdatedDeal, setRecentlyUpdatedDeal] = useState<number | null>(null);
  const [showExpiredConfirmation, setShowExpiredConfirmation] = useState(false);
  const [floatingDate, setFloatingDate] = useState<string | null>(null);
  const [showFloatingDate, setShowFloatingDate] = useState(false);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const [dealsScrolled, setDealsScrolled] = useState(false);
  const [completedTrackingsCount, setCompletedTrackingsCount] = useState(0);
  const overflowMenuRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const dealsContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect desktop vs mobile
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Close overflow menu on outside click (desktop only)
  useEffect(() => {
    if (!isDesktop || activeOverflowMenu === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (overflowMenuRef.current && !overflowMenuRef.current.contains(event.target as Node)) {
        setActiveOverflowMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeOverflowMenu, isDesktop]);

  // Close dropdown menu on outside click (desktop only)
  useEffect(() => {
    if (!isDesktop || openDropdown === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside any dropdown
      const isClickInsideDropdown = target.closest('.dropdown-container');
      if (!isClickInsideDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown, isDesktop]);

  // Floating date indicator on scroll
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || activeTab !== 'chat') return;

    const handleScroll = () => {
      // Show floating date when scrolling
      setShowFloatingDate(true);

      // Get the topmost visible message in the viewport
      const messageElements = chatContainer.querySelectorAll('[data-message-date]');
      let firstVisibleDate: string | null = null;

      for (const el of Array.from(messageElements)) {
        const rect = el.getBoundingClientRect();
        const containerRect = chatContainer.getBoundingClientRect();
        
        // Check if message is visible in the container (with offset for header/tabs)
        const offset = 100; // Account for header and tabs
        if (rect.top >= containerRect.top + offset && rect.top <= containerRect.bottom) {
          firstVisibleDate = el.getAttribute('data-message-date');
          break;
        }
      }

      if (firstVisibleDate) {
        setFloatingDate(firstVisibleDate);
      }

      // Hide floating date after scrolling stops
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setShowFloatingDate(false);
      }, 1000);
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => {
      chatContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeTab]);

  // Scroll to latest message detection
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || activeTab !== 'chat') return;

    const checkIfAtBottom = () => {
      const threshold = 100; // pixels from bottom to consider "at bottom"
      const isAtBottom = 
        chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < threshold;
      setShowScrollToLatest(!isAtBottom);
    };

    // Check on scroll
    chatContainer.addEventListener('scroll', checkIfAtBottom);
    
    // Check initially and when messages change
    checkIfAtBottom();

    return () => {
      chatContainer.removeEventListener('scroll', checkIfAtBottom);
    };
  }, [activeTab, messages]);

  // Deals view scroll detection for sticky tabs collapse (both main and sub-tabs)
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer || activeTab !== 'deals') return;

    const handleDealsScroll = () => {
      const scrollTop = chatContainer.scrollTop;
      // Collapse both main tabs and sub-tabs when scrolled down more than 10px
      const shouldCollapse = scrollTop > 10;
      setDealsScrolled(shouldCollapse);
      setIsTabsCollapsed(shouldCollapse);
    };

    chatContainer.addEventListener('scroll', handleDealsScroll);
    
    // Check initially
    handleDealsScroll();

    return () => {
      chatContainer.removeEventListener('scroll', handleDealsScroll);
    };
  }, [activeTab]);

  const scrollToLatestMessage = () => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth'
    });
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [shouldShowWelcomeBack, setShouldShowWelcomeBack] = useState(false);
  const [otpReturnPage, setOtpReturnPage] = useState<'chat' | 'account'>('chat');
  const [hasShownLoginSuggestion, setHasShownLoginSuggestion] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Scroll detection for tabs collapse behavior
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;

    const handleScroll = () => {
      const scrollTop = chatContainer.scrollTop;
      // Collapse tabs when scrolled down more than 80px
      setIsTabsCollapsed(scrollTop > 80);
    };

    chatContainer.addEventListener('scroll', handleScroll);
    return () => chatContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for navigation events from cookie banner
  useEffect(() => {
    const handleNavigateToPrivacy = () => {
      setCurrentPage('privacy');
    };

    window.addEventListener('navigate-to-privacy', handleNavigateToPrivacy);
    
    return () => {
      window.removeEventListener('navigate-to-privacy', handleNavigateToPrivacy);
    };
  }, []);

  // Console helper for accessing UI Foundations page
  useEffect(() => {
    console.log('%c🎨 Oshiya UI Foundations', 'color: #9333ea; font-size: 14px; font-weight: bold;');
    console.log('%cTo view the UI Foundations documentation page, use:', 'color: #666; font-size: 12px;');
    console.log('%c(window as any).oshiyaNavigate("ui-foundations")', 'background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-family: monospace;');
    
    // Expose navigation function to window for console access
    (window as any).oshiyaNavigate = (page: string) => {
      // Runtime check to validate that the page is in the allowed list
      const allowedPages: PageType[] = ['chat', 'about', 'what', 'how', 'privacy', 'terms', 'demo', 'accessibility', 'accessibility-statement', 'contact', 'login', 'otp', 'account', 'profile', 'trackings', 'settings', 'payment', 'premium-selection', 'ui-foundations'];
      // Type guard: check if page is a valid PageType using type narrowing
      const isValidPage = (p: string): p is PageType => {
        return (allowedPages as readonly string[]).includes(p);
      };
      if (isValidPage(page)) {
        setCurrentPage(page);
      } else {
        console.warn(`Invalid page: ${page}. Allowed pages:`, allowedPages);
      }
    };
  }, []);

  // Mark first visit flag and restore conversation state from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('oshiya-messages');
    const savedConversationState = localStorage.getItem('oshiya-conversation-state');
    const savedIsLoggedIn = localStorage.getItem('oshiya-logged-in');
    const isFirstVisit = localStorage.getItem('oshiyafirstvisit') === null;

    if (savedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }

    // If there are saved messages, restore them (this overrides initial messages)
    if (savedMessages && savedConversationState) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        const parsedState = JSON.parse(savedConversationState);
        
        // Restore messages with Date objects
        const restoredMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        
        setMessages(restoredMessages);
        setConversationState(parsedState);
        
        // Mark as not first visit since we have saved messages
        localStorage.setItem('oshiyafirstvisit', 'false');
      } catch (error) {
        console.error('Failed to restore conversation:', error);
      }
    } else {
      // Mark first visit flag if this is a first-time user and no saved messages
      if (isFirstVisit) {
        localStorage.setItem('oshiyafirstvisit', 'false');
      }
    }
  }, []);

  // Save conversation state to localStorage whenever it changes
  useEffect(() => {
    // Only save if we have more than the initial messages (2 for first-time, 1 for returning)
    if (messages.length > 2 || (messages.length === 2 && messages[0].id !== 1)) {
      // Remove contentJSX before saving (it contains React elements that can't be serialized)
      const messagesForStorage = messages.map(msg => {
        const { contentJSX, ...rest } = msg;
        return rest;
      });
      localStorage.setItem('oshiya-messages', JSON.stringify(messagesForStorage));
      localStorage.setItem('oshiya-conversation-state', JSON.stringify(conversationState));
    }
  }, [messages, conversationState]);

  // Save login state to localStorage
  useEffect(() => {
    localStorage.setItem('oshiya-logged-in', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  // Development-only keyboard shortcut to reset onboarding (Shift+R)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyDown = (event: KeyboardEvent) => {
        // Check for Shift+R
        if (event.shiftKey && event.key === 'R') {
          event.preventDefault();
          
          // Remove the onboarding flag from localStorage
          localStorage.removeItem('oshiyafirstvisit');
          
          // Clear saved messages and conversation state to ensure onboarding shows
          // (Otherwise the useEffect at line 472 would restore saved messages and override onboarding)
          localStorage.removeItem('oshiya-messages');
          localStorage.removeItem('oshiya-conversation-state');
          
          // Reload the page to trigger first-time user experience
          window.location.reload();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  // Show welcome-back message when returning to chat after login
  useEffect(() => {
    if (shouldShowWelcomeBack && currentPage === 'chat' && messages.length > 2) {
      setShouldShowWelcomeBack(false);
      
      // Add welcome-back message with smooth animation
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const welcomeBackMessage: Message = {
            id: Date.now(),
            type: 'assistant',
            contentJSX: (
              <span className="animate-fade-in">
                היי, חזרת אלי
                <br />
                טוב לראות אותך שוב.
              </span>
            ),
            content: 'היי, חזרת אליי 😊\nטוב לראות אותך שוב.\nטוב לראות אותך שוב.',
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, welcomeBackMessage]);
          setIsTyping(false);
          
          // Add continuation question with quick replies after a brief pause
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              const continuationMessage: Message = {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'מה בא לך לבדוק? יש לך מוצר ספציפי בראש?',
                quickReplies: [
                  { label: 'כן, יש לי מוצר', value: 'כן, יש לי מוצר' },
                  { label: 'לא, אשמח לעזרה', value: 'לא, אשמח לעזרה' },
                ],
                timestamp: new Date(),
              };
              
              setMessages(prev => [...prev, continuationMessage]);
              setIsTyping(false);
              
              // Focus input after messages appear
              setTimeout(() => {
                textareaRef.current?.focus();
              }, 100);
            }, 600);
          }, 400);
        }, 600);
      }, 200);
    }
  }, [shouldShowWelcomeBack, currentPage, messages.length]);

  // Show soft login suggestion for users with value in the system
  const showLoginSuggestion = () => {
    // Check conditions: not logged in, has WhatsApp, completed setup flow, hasn't shown before, in chat view
    const hasWhatsApp = !!conversationState.productData.phone;
    const hasCompletedSetup = conversationState.step >= 8; // User completed WhatsApp step
    
    if (!isLoggedIn && hasWhatsApp && hasCompletedSetup && !hasShownLoginSuggestion && activeTab === 'chat') {
      setHasShownLoginSuggestion(true);
      
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'assistant',
            content: 'אגב, אם בא לכם לראות את כל המעקבים שלכם במקום אחד\nאפשר להתחבר לאזור האישי עם המספר שלכם 😊',
            quickReplies: [
              { label: 'להתחבר עכשיו', value: 'login-suggestion-yes' },
              { label: 'לא עכשיו', value: 'login-suggestion-no' }
            ],
            timestamp: new Date(),
          }]);
          setIsTyping(false);
        }, 800);
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: message || '📸 תמונה',
      image: uploadedImage || undefined,
      source: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Store product data if in conversation flow
    if (conversationState.path === 'has-product' && conversationState.step === 2) {
      // This is when user provides product info - send to AI
      const messageContent = message.trim();
      
      // Prepare messages for AI API (include conversation history)
      const conversationMessages = messages
        .map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: typeof msg.content === 'string' ? msg.content : (msg.image ? 'העליתי תמונה' : ''),
        }))
        .filter(msg => msg.content.length > 0); // Only include messages with content
      
      // Add current user message
      conversationMessages.push({
        role: 'user',
        content: messageContent || (uploadedImage ? 'העליתי תמונה' : ''),
      });

      setIsTyping(true);
      
      try {
        // Send to OpenAI API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationMessages,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content || 'לא הצלחתי לקבל תשובה. נסי שוב.';
        
        // Add AI response to messages
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: aiContent,
          source: 'ai',
          timestamp: new Date(),
        }]);

      // Detect if message contains a link
      const urlRegex = /(https?:\/\/[^\s]+)/g;
        const hasLink = urlRegex.test(messageContent);
        const link = hasLink ? messageContent.match(urlRegex)?.[0] : undefined;
      
        // Update conversation state with extracted information
      setConversationState(prev => ({
        ...prev,
        step: 3,
        productData: { 
          ...prev.productData, 
            name: messageContent, 
          link: link || prev.productData.link,
          image: uploadedImage || undefined 
        }
      }));
      
      // Mark product name question as asked
      setAskedQuestions(prev => new Set(prev).add('product-name'));
        
        setIsTyping(false);
      } catch (error) {
        console.error('Error calling AI API:', error);
        setIsTyping(false);
        // On error, continue with basic flow
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const hasLink = urlRegex.test(messageContent);
        const link = hasLink ? messageContent.match(urlRegex)?.[0] : undefined;
        
        setConversationState(prev => ({
          ...prev,
          step: 3,
          productData: { 
            ...prev.productData, 
            name: messageContent, 
            link: link || prev.productData.link,
            image: uploadedImage || undefined 
          }
        }));
        
        setAskedQuestions(prev => new Set(prev).add('product-name'));
      }
      
      // Clear input after processing
      setMessage('');
      setUploadedImage(null);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      return; // Exit early - AI response has been handled
    } else if (conversationState.path === 'needs-help' && conversationState.step >= 1) {
      // All messages in needs-help flow go through AI
      const messageContent = message.trim();
      
      // Prepare messages for AI API (include conversation history)
      const conversationMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
      
      // Always include system message for needs-help flow to maintain context
      conversationMessages.push({
        role: 'system',
        content: 'המשתמש מבקש עזרה למצוא מוצר שמתאים לצרכים שלו. אתה עוזר דיגיטלי בשם אושייה. שאל שאלות כדי להבין: סוג המוצר (קטגוריה), מה חשוב לו במוצר, והתקציב שלו. השתמש בעברית ובתרבות ישראלית. היה ידידותי ומקצועי.',
      });
      
      // Add conversation history (user and assistant messages)
      messages.forEach(msg => {
        if (msg.type === 'user' || msg.type === 'assistant') {
          const content = typeof msg.content === 'string' ? msg.content : (msg.image ? 'העליתי תמונה' : '');
          if (content.length > 0) {
            conversationMessages.push({
              role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
              content: content,
            });
          }
        }
      });
      
      // Add current user message
      conversationMessages.push({
        role: 'user',
        content: messageContent || (uploadedImage ? 'העליתי תמונה' : ''),
      });

      setIsTyping(true);
      
      try {
        // Send to OpenAI API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: conversationMessages,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content || 'אני מבינה. ספרי לי עוד על מה שאת מחפשת.';
        
        // Add AI response to messages
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: aiContent,
          source: 'ai',
          timestamp: new Date(),
        }]);

        // Try to extract product information from the conversation
        // Detect if message contains a link
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const hasLink = urlRegex.test(messageContent);
        const link = hasLink ? messageContent.match(urlRegex)?.[0] : undefined;
        
        // Update conversation state - increment step and save any extracted data
        setConversationState(prev => {
          const newStep = prev.step + 1;
          const updatedData = { ...prev.productData };
          
          // Try to extract category, name, requirements, budget from context
          // This is a simple extraction - in production you might want more sophisticated parsing
          if (prev.step === 1 && messageContent.length > 0) {
            // First response might contain category info
            updatedData.category = messageContent;
          }
          
          return {
            ...prev,
            step: newStep,
            productData: {
              ...updatedData,
              name: updatedData.name || messageContent,
              link: link || updatedData.link,
              image: uploadedImage || updatedData.image,
            },
          };
        });
        
        setIsTyping(false);
      } catch (error) {
        console.error('Error calling AI API:', error);
        setIsTyping(false);
        // On error, show fallback message
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'אופס, משהו השתבש. בואי ננסה שוב?',
          source: 'script',
          timestamp: new Date(),
        }]);
      }
      
      // Clear input after processing
      setMessage('');
      setUploadedImage(null);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      return; // Exit early - AI response has been handled
    } else if (conversationState.path === 'has-product' && conversationState.step === 3) {
      // User provided link or image after being asked
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasLink = urlRegex.test(message);
      const link = hasLink ? message.match(urlRegex)?.[0] : undefined;
      
      setConversationState(prev => ({
        ...prev,
        step: 4,
        productData: { 
          ...prev.productData, 
          link: link || prev.productData.link,
          image: uploadedImage || prev.productData.image
        }
      }));
      
      // Mark link question as asked
      setAskedQuestions(prev => new Set(prev).add('product-link'));
    }
    
    setMessage('');
    setUploadedImage(null);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Continue flow based on conversation state
    if (conversationState.path === 'has-product' && conversationState.step === 3) {
      // After product name - check if we have link or image
      const hasLinkOrImage = conversationState.productData.link || conversationState.productData.image || uploadedImage;
      
      if (!hasLinkOrImage && !askedQuestions.has('product-link')) {
        // Ask for link/image only if not already asked
        setAskedQuestions(prev => new Set(prev).add('product-link'));
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'assistant',
            content: 'יש לך לינק למוצר או תמונה שלו?\nזה יעזור לי לעקוב בדיוק אחרי הפריט הנכון.',
            quickReplies: [
              { label: 'אין לי, נמשיך ככה', value: 'skip-link' },
            ],
            timestamp: new Date(),
          }]);
          setIsTyping(false);
          // Don't advance step yet - wait for their response
        }, 1000);
      } else {
        // We have all required info (name is required, link/image already provided or not needed)
        // Advance to step 4 and ask for price target
        setConversationState(prev => ({ ...prev, step: 4 }));
        setAskedQuestions(prev => new Set(prev).add('product-details-complete'));
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'assistant',
            content: 'מה יעד המחיר שלך? את יכולה לבחור סכום מדויק, אחוז ירידה – או לתת לי לבחור מתי זה משתלם :)',
            source: 'script',
            timestamp: new Date(),
          }]);
          setIsTyping(false);
          
          // Show inline inputs for price options
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setMessages(prev => [...prev, {
                id: Date.now() + 2,
                type: 'assistant',
                contentJSX: (
                  <div>
                    <InlineInputs
                      inputs={[
                        { id: 'price', type: 'number', placeholder: 'מחיר (למשל: 2500)' },
                        { id: 'percentDrop', type: 'number', placeholder: 'אחוז ירידה (למשל: 10)' }
                      ]}
                      submitLabel="שלח"
                      onSubmit={async (values) => {
                        const price = (values.price as string)?.trim();
                        const percentDrop = (values.percentDrop as string)?.trim();
                        
                        if (price) {
                          // User chose specific price
                          handleQuickReply(`price-submit:target_price:${price}`);
                        } else if (percentDrop) {
                          // User chose percent drop
                          handleQuickReply(`price-submit:percent_drop:${percentDrop}`);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleQuickReply('price-auto')}
                      className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-300"
                      style={{ minHeight: '44px' }}
                    >
                      תבחרי את בשבילי
                    </button>
                  </div>
                ),
                content: '',
                source: 'script',
                timestamp: new Date(),
              }]);
              setIsTyping(false);
            }, 800);
          }, 500);
        }, 800);
      }
    } else if (conversationState.path === 'has-product' && conversationState.step === 4) {
      // After link/image provided - ask for price target
      setConversationState(prev => ({ ...prev, step: 5 }));
      setAskedQuestions(prev => new Set(prev).add('product-details-complete'));
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מה יעד המחיר שלך? את יכולה לבחור סכום מדויק, אחוז ירידה – או לתת לי לבחור מתי זה משתלם :)',
          source: 'script',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        
        // Show inline inputs for price options
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              contentJSX: (
                <div>
                  <InlineInputs
                    inputs={[
                      { id: 'price', type: 'number', placeholder: 'מחיר (למשל: 2500)' },
                      { id: 'percentDrop', type: 'number', placeholder: 'אחוז ירידה (למשל: 10)' }
                    ]}
                    submitLabel="שלח"
                    onSubmit={async (values) => {
                      const price = (values.price as string)?.trim();
                      const percentDrop = (values.percentDrop as string)?.trim();
                      
                      if (price) {
                        // User chose specific price
                        handleQuickReply(`price-submit:target_price:${price}`);
                      } else if (percentDrop) {
                        // User chose percent drop
                        handleQuickReply(`price-submit:percent_drop:${percentDrop}`);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleQuickReply('price-auto')}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-300"
                    style={{ minHeight: '44px' }}
                  >
                    תבחרי את בשבילי
                  </button>
                </div>
              ),
              content: '',
              source: 'script',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
          }, 800);
        }, 500);
      }, 800);
    } else if (conversationState.path === 'needs-help' && conversationState.step === 3) {
      // After category - ask about requirements
      setConversationState(prev => ({
        ...prev,
        step: 4,
        productData: { ...prev.productData, category: message }
      }));
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מה חשוב לך שיהיה בו?\\nמותג מסוים, עיצוב, ביצועים, מחיר, המלצות, מידה…',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        setConversationState(prev => ({ ...prev, step: 5 }));
      }, 1000);
    } else if (conversationState.path === 'needs-help' && conversationState.step === 5) {
      // After requirements - ask about budget
      setConversationState(prev => ({
        ...prev,
        step: 6,
        productData: { ...prev.productData, requirements: message }
      }));
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'יש תקציב מסוים?\\nאו טווח מחיר שלא בא לך לעבור אותו?',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        setConversationState(prev => ({ ...prev, step: 7 }));
      }, 1000);
    } else if (conversationState.path === 'needs-help' && conversationState.step === 7) {
      // After budget - ask if they have an example
      setConversationState(prev => ({
        ...prev,
        step: 8,
        productData: { ...prev.productData, budget: message }
      }));
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'אם יש משהו שראית ואת מתלבטת לגביו –\\nתשלחי לינק או תמונה, זה יכול לעזור לי להבין בדיוק מה את מחפשת.',
          timestamp: new Date(),
        }]);
        setIsTyping(false);

        // Soft closing after 2s
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              content: 'מעולה. תני לזה רגע להתבשל 🙂\\nברגע שיהיה משהו בעין – תקפיצי לי. אני פה ✌️',
              timestamp: new Date(),
            }]);
            setIsTyping(false);

            // AI moment hint
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
                      <br />• \"מה באמת ההבדל בין הדגמים?\"\n                      <br />• \"שווה לחכות לגרסה הבאה?\"\n                    </span>
                  ),
                  content: 'אם יש לך שאלה פתוחה – א����י כאן.\\nלמשל:\\n• \"מה באמת ההבדל בין הדגמים?\"\\n• \"שווה לחכות ��גרסה הבאה?\"',
                  timestamp: new Date(),
                }]);
                setIsTyping(false);
              }, 1000);
            }, 1500);
          }, 1000);
        }, 2000);
      }, 1000);
    } else {
      // Default fallback for free conversation
      setIsTyping(true);
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          type: 'assistant',
          content: uploadedImage 
            ? 'מעולה! אני רואה את התמונה שהעלית. \n\nאני יכולה לעזור לך למצוא את המוצר הזה במחיר הטוב ביותר!\n\nספרי לי עוד על המוצר - איזה דגם זה? מה התקציב שלך?'
            : 'מעולה! אני יכולה לעזור לך עם זה.\n\nבשביל לעקוב אחרי המוצר, אני צריכה קצת פרטים:\n• מה המוצר שת מחפשת?\n• יש לך קישור למוצר באתר מסוים?\n• מה התקציב שלך?',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 200); // Max height 200px (about 8 lines)
    textarea.style.height = `${newHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
    // Allow Shift+Enter for new line
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('נא להעלות קובץ תמונה בלבד');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('הקובץ גדול מדי. גודל מקסימלי: 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  // Helper function to submit to intake API
  const submitToIntakeAPI = async (firstName: string, phone_e164: string, whatsapp_consent: boolean) => {
    const productData = conversationState.productData;
    const productName = productData.name || 'מוצר';
    
    // Show user's submission
    const maskedPhone = phone_e164.slice(0, 6) + '***' + phone_e164.slice(-3);
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: `${firstName}, ${maskedPhone}`,
      timestamp: new Date(),
    }]);

    setIsTyping(true);
    
    try {
          // Prepare data for API
          // Use target_type and target_value from productData if available
          const targetType = productData.target_type || (productData.priceTarget ? 'target_price' : 'percent_drop');
          const targetValue = productData.target_value || (productData.priceTarget 
            ? parseFloat(productData.priceTarget.replace(/[^\d.]/g, ''))
            : 10); // Default to 10% drop if no price target

      // Determine store_key from product URL or use a default
      const productUrl = productData.link || '';
      let storeKey = 'unknown';
      try {
        const url = new URL(productUrl);
        const hostname = url.hostname;
        // Extract store key from hostname (simplified - you may want to improve this)
        if (hostname.includes('bug')) storeKey = 'bug';
        else if (hostname.includes('ksp')) storeKey = 'ksp';
        else if (hostname.includes('idigital')) storeKey = 'idigital';
        // Add more stores as needed
      } catch (e) {
        // If URL parsing fails, use default
      }

      const intakePayload = {
        product_name: productName,
        store_key: storeKey,
        product_url: productUrl,
        target_type: targetType,
        target_value: targetValue,
        phone_e164: phone_e164,
        whatsapp_consent: whatsapp_consent,
      };

      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(intakePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit tracking request');
      }

      // Success - show confirmation message (after API call succeeds)
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: `סגור! אני עוקבת אחרי: ${productName} 🎯\nאשלח לך הודעת וואטסאפ כשהמחיר יגיע ליעד!`,
          source: 'script',
          timestamp: new Date(),
        }]);

        // Suggest personal area
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              content: 'אפשר לראות את זה גם באזור האישי שלך.',
              source: 'script',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
            
            // Ask continuation question
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: Date.now() + 3,
                  type: 'assistant',
                  content: 'רוצה לבדוק עוד מוצר?',
                  source: 'script',
                  quickReplies: [
                    { label: 'כן, בואי', value: 'check-another-product' },
                    { label: 'לא, תודה', value: 'no-more-products' },
                  ],
                  timestamp: new Date(),
                }]);
                setIsTyping(false);
              }, 800);
            }, 1000);
          }, 800);
        }, 1000);
      }, 800);
    } catch (error) {
      console.error('Error submitting to intake API:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'אופס, משהו השתבש 😅\nבואי ננסה שוב בעוד רגע?',
        source: 'script',
        timestamp: new Date(),
      }]);
    }
  };

  const handleQuickReply = (value: string) => {
    // Handle initial product question
    if (value === 'has-specific-product') {
      setAskedQuestions(prev => new Set(prev).add('initial-product-question'));
      
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'כן, יש לי מוצר',
        source: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      setConversationState({ path: 'has-product', step: 1, productData: {} });
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מעולה 🙂 תספרי לי על המוצר, או פשוט תעלי תמונה או לינק – מה שזורם לך.',
          source: 'script',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        setConversationState(prev => ({ ...prev, step: 2 }));
      }, 800);
      return;
    }
    
    if (value === 'needs-help-choosing') {
      setAskedQuestions(prev => new Set(prev).add('initial-product-question'));
      
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'לא ממש, אשמח לעזרה',
        source: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      setConversationState({ path: 'needs-help', step: 1, productData: {} });
      
      // Send initial system prompt to AI
      setIsTyping(true);
      
      const systemPrompt = 'המשתמש מבקש עזרה למצוא מוצר שמתאים לצרכים שלו. אתה עוזר דיגיטלי בשם אושייה. התחל בכך שתשאל את המשתמש שאלות כדי להבין מה הוא מחפש. שאל על: סוג המוצר (קטגוריה), מה חשוב לו במוצר, והתקציב שלו. השתמש בעברית ובתרבות ישראלית. היה ידידותי ומקצועי.';
      
      // Prepare initial messages for AI
      const initialMessages = [
        {
          role: 'system' as const,
          content: systemPrompt,
        },
        {
          role: 'user' as const,
          content: 'לא ממש, אשמח לעזרה',
        },
      ];

      const fetchAIResponse = async () => {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: initialMessages,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to get AI response');
          }

          const data = await response.json();
          const aiContent = data.choices?.[0]?.message?.content || 'הכי מעניין! בואי נעזור לך להבין מה שווה לך לבדוק בכלל – ואז נתקדם למעקב.';
          
          setIsTyping(false);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              type: 'assistant',
              content: aiContent,
              source: 'ai',
              timestamp: new Date(),
            }]);
          }, 800);
        } catch (error) {
          console.error('Error calling AI API:', error);
          setIsTyping(false);
          // Fallback to scripted message on error
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              type: 'assistant',
              content: 'הכי מעניין!\nבואי נעזור לך להבין מה שווה לך לבדוק בכלל – ואז נתקדם למעקב.',
              source: 'script',
              timestamp: new Date(),
            }]);
          }, 800);
        }
      };
      
      fetchAIResponse();
      
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: value,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response based on conversation flow

    // Path 1: "כן, יש לי מוצר"
    if (value === 'כן, יש לי מוצר') {
      setConversationState({ path: 'has-product', step: 1, productData: {} });
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מעולה 🙂\nתספרי לי על המוצר, או פשוט תעלי תמונה או לינק – מה שזורם לך.',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        setConversationState(prev => ({ ...prev, step: 2 }));
      }, 800);
    }

    // Path 2: "לא, אשמח לעזרה"
    else if (value === 'לא, אשמח לעזרה') {
      setConversationState({ path: 'needs-help', step: 1, productData: {} });
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'הכי מעניין!\nבואי נעזור לך להבין מה שווה לך לבדוק בכלל – ואז נתקדם למעקב.',
          timestamp: new Date(),
        }]);
        setIsTyping(false);

        // Follow-up message
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              content: 'איזו קטגוריה מעניינת אותך?\n(למשל: טלפון, שואב אבק, מחשב, מוצר טיפוח...)',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
            setConversationState(prev => ({ ...prev, step: 2 }));
          }, 1000);
        }, 1200);
      }, 800);
    }

    // Handle skip link option
    if (value === 'skip-link') {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'אין לי, נמשיך ככה',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Proceed to price target question
      setConversationState(prev => ({ ...prev, step: 4 }));
      setAskedQuestions(prev => new Set(prev).add('product-details-complete'));
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מה יעד המחיר שלך? את יכולה לבחור סכום מדויק, אחוז ירידה – או לתת לי לבחור מתי זה משתלם :)',
          source: 'script',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        
        // Show inline inputs for price options
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              contentJSX: (
                <div>
                  <InlineInputs
                    inputs={[
                      { id: 'price', type: 'number', placeholder: 'מחיר (למשל: 2500)' },
                      { id: 'percentDrop', type: 'number', placeholder: 'אחוז ירידה (למשל: 10)' }
                    ]}
                    submitLabel="שלח"
                    onSubmit={async (values) => {
                      const price = (values.price as string)?.trim();
                      const percentDrop = (values.percentDrop as string)?.trim();
                      
                      if (price) {
                        // User chose specific price
                        handleQuickReply(`price-submit:target_price:${price}`);
                      } else if (percentDrop) {
                        // User chose percent drop
                        handleQuickReply(`price-submit:percent_drop:${percentDrop}`);
                      }
                    }}
                  />
                  <button
                    onClick={() => handleQuickReply('price-auto')}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-300"
                    style={{ minHeight: '44px' }}
                  >
                    תבחרי את בשבילי
                  </button>
                </div>
              ),
              content: '',
              source: 'script',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
          }, 800);
        }, 500);
      }, 800);
      return;
    }

    // Handle phone submission
    if (value.startsWith('phone-submit:')) {
      const phone = value.substring('phone-submit:'.length).replace(/\s/g, '');
      const isValidIsraeliPhone = /^05\d{8}$/.test(phone);
      
      if (!isValidIsraeliPhone) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'assistant',
          contentJSX: (
            <div>
              <p className="mb-2">נראה לי שהמספר קצת קצר 😅</p>
              <p className="mb-2">בא לך לבדוק שוב?</p>
              <InlineInputs
                inputs={[{ id: 'phone', type: 'tel', placeholder: 'מספר טלפון (לדוגמה: 0501234567)', inputMode: 'tel' }]}
                submitLabel="סגור, שלחי"
                onSubmit={(retryValues) => {
                  handleQuickReply(`phone-submit:${retryValues.phone}`);
                }}
              />
            </div>
          ),
          content: '',
          timestamp: new Date(),
        }]);
        return;
      }
      
      const maskedPhone = phone.slice(0, 3) + '***' + phone.slice(-4);
      setConversationState(prev => ({ ...prev, step: 7, productData: { ...prev.productData, phone: phone } }));
      setMessages(prev => [...prev, { id: Date.now(), type: 'user', content: maskedPhone, timestamp: new Date() }]);
      
      // Check if we have firstName already
      const hasFirstName = conversationState.productData.firstName;
      
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          if (!hasFirstName) {
            // Ask for first name
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              type: 'assistant',
              content: 'רק שאדע איך לפנות אלייך – איך לקרוא לך?',
              contentJSX: (
                <div>
                  <p className="mb-2">רק שאדע איך לפנות אלייך – איך לקרוא לך?</p>
                  <InlineInputs
                    inputs={[{ id: 'firstName', type: 'text', placeholder: 'שם פרטי' }]}
                    submitLabel="סגור, שלחי"
                    onSubmit={(nameValues) => {
                      handleQuickReply(`name-submit:${nameValues.firstName}`);
                    }}
                  />
                </div>
              ),
              timestamp: new Date(),
            }]);
          } else {
            // Show tracking confirmation
            handleQuickReply('show-tracking-confirmation');
          }
          setIsTyping(false);
        }, 800);
      }, 500);
      return;
    }

    // Handle name submission
    if (value.startsWith('name-submit:')) {
      const firstName = value.substring('name-submit:'.length);
      setConversationState(prev => ({ ...prev, step: 8, productData: { ...prev.productData, firstName } }));
      setMessages(prev => [...prev, { id: Date.now(), type: 'user', content: firstName, timestamp: new Date() }]);
      
      // Show tracking confirmation
      setTimeout(() => {
        handleQuickReply('show-tracking-confirmation');
      }, 300);
      return;
    }

    // Final step: Collect WhatsApp details and send to API
    if (value === 'show-tracking-confirmation') {
      setConversationState(prev => ({ ...prev, step: 9 }));
      setIsTyping(true);
      setTimeout(() => {
        const productName = conversationState.productData.name || 'המוצר';
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          contentJSX: (
            <div>
              <p className="mb-3">רק עוד שנייה ואני על זה 👀</p>
              <p className="mb-3">אני צריכה כמה פרטים כדי לשלוח לך עדכונים בוואטסאפ:</p>
              <InlineInputs
                inputs={[
                  {
                    id: 'firstName',
                    type: 'text',
                    placeholder: 'כינוי',
                    value: conversationState.productData.firstName || '',
                  },
                  {
                    id: 'phone_e164',
                    type: 'tel',
                    placeholder: 'מספר וואטסאפ (+972501234567)',
                    inputMode: 'tel',
                  },
                  {
                    id: 'whatsapp_consent',
                    type: 'checkbox',
                    label: 'אני מאשר/ת לקבל עדכונים בוואטסאפ',
                    checked: false,
                  },
                ]}
                submitLabel="סגור, שלחי"
                onSubmit={async (values) => {
                  const firstName = (values.firstName as string)?.trim() || '';
                  const phone_e164 = (values.phone_e164 as string)?.trim() || '';
                  const whatsapp_consent = values.whatsapp_consent as boolean;

                  // Validate inputs
                  const isValidPhone = /^\+972\d{8,9}$/.test(phone_e164);
                  const errors: string[] = [];
                  
                  if (!firstName) {
                    errors.push('כינוי הוא שדה חובה');
                  }
                  
                  if (!isValidPhone) {
                    errors.push('מספר וואטסאפ חייב להיות בפורמט בינלאומי (+972501234567)');
                  }
                  
                  if (!whatsapp_consent) {
                    errors.push('יש לאשר קבלת עדכונים בוואטסאפ');
                  }
                  
                  // Show errors if any
                  if (errors.length > 0) {
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      type: 'assistant',
                      contentJSX: (
                        <div>
                          <p className="mb-2 font-medium">יש כמה דברים לתקן:</p>
                          <ul className="mb-3 list-disc list-inside text-sm text-gray-700 space-y-1">
                            {errors.map((error, idx) => (
                              <li key={idx}>{error}</li>
                            ))}
                          </ul>
                          <InlineInputs
                            inputs={[
                              {
                                id: 'firstName',
                                type: 'text',
                                placeholder: 'כינוי',
                                value: firstName,
                              },
                              {
                                id: 'phone_e164',
                                type: 'tel',
                                placeholder: 'מספר וואטסאפ (+972501234567)',
                                inputMode: 'tel',
                              },
                              {
                                id: 'whatsapp_consent',
                                type: 'checkbox',
                                label: 'אני מאשר/ת לקבל עדכונים בוואטסאפ',
                                checked: whatsapp_consent,
                              },
                            ]}
                            submitLabel="סגור, שלחי"
                            onSubmit={async (retryValues) => {
                              const retryFirstName = (retryValues.firstName as string)?.trim() || '';
                              const retryPhone = (retryValues.phone_e164 as string)?.trim() || '';
                              const retryConsent = retryValues.whatsapp_consent as boolean;

                              const retryErrors: string[] = [];
                              
                              if (!retryFirstName) {
                                retryErrors.push('כינוי הוא שדה חובה');
                              }
                              
                              if (!/^\+972\d{8,9}$/.test(retryPhone)) {
                                retryErrors.push('מספר וואטסאפ חייב להיות בפורמט בינלאומי (+972501234567)');
                              }
                              
                              if (!retryConsent) {
                                retryErrors.push('יש לאשר קבלת עדכונים בוואטסאפ');
                              }
                              
                              if (retryErrors.length > 0) {
                                setMessages(prev => [...prev, {
                                  id: Date.now(),
                                  type: 'assistant',
                                  contentJSX: (
                                    <div>
                                      <p className="mb-2 font-medium">יש כמה דברים לתקן:</p>
                                      <ul className="mb-3 list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {retryErrors.map((error, idx) => (
                                          <li key={idx}>{error}</li>
                                        ))}
                                      </ul>
                                      <InlineInputs
                                        inputs={[
                                          {
                                            id: 'firstName',
                                            type: 'text',
                                            placeholder: 'כינוי',
                                            value: retryFirstName,
                                          },
                                          {
                                            id: 'phone_e164',
                                            type: 'tel',
                                            placeholder: 'מספר וואטסאפ (+972501234567)',
                                            inputMode: 'tel',
                                          },
                                          {
                                            id: 'whatsapp_consent',
                                            type: 'checkbox',
                                            label: 'אני מאשר/ת לקבל עדכונים בוואטסאפ',
                                            checked: retryConsent,
                                          },
                                        ]}
                                        submitLabel="סגור, שלחי"
                                        onSubmit={async (finalValues) => {
                                          const finalFirstName = (finalValues.firstName as string)?.trim() || '';
                                          const finalPhone = (finalValues.phone_e164 as string)?.trim() || '';
                                          const finalConsent = finalValues.whatsapp_consent as boolean;

                                          // Final validation (should not be needed if user fixes everything, but just in case)
                                          if (!finalFirstName || !/^\+972\d{8,9}$/.test(finalPhone) || !finalConsent) {
                                            // Show simple error message
                                            setMessages(prev => [...prev, {
                                              id: Date.now(),
                                              type: 'assistant',
                                              content: 'אנא ודאי שכל השדות מלאים והם תקינים 😊',
                                              source: 'script',
                                              timestamp: new Date(),
                                            }]);
                                            return;
                                          }

                                          await submitToIntakeAPI(finalFirstName, finalPhone, finalConsent);
                                        }}
                                      />
                                    </div>
                                  ),
                                  content: 'יש כמה דברים לתקן',
                                  source: 'script',
                                  timestamp: new Date(),
                                }]);
                                return;
                              }

                              await submitToIntakeAPI(retryFirstName, retryPhone, retryConsent);
                            }}
                          />
                        </div>
                      ),
                      content: 'יש כמה דברים לתקן',
                      source: 'script',
                      timestamp: new Date(),
                    }]);
                    return;
                  }

                  // All validations passed - submit to API
                  await submitToIntakeAPI(firstName, phone_e164, whatsapp_consent);
                }}
              />
            </div>
          ),
          content: 'רק עוד שנייה ואני על זה 👀\nאני צריכה כמה פרטים כדי לשלוח לך עדכונים בוואטסאפ:',
          source: 'script',
                  timestamp: new Date(),
                }]);
                setIsTyping(false);
      }, 800);
      return;
    }

    // Handle check another product
    if (value === 'check-another-product') {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'כן, בואי',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Reset to main question
      setConversationState({ path: 'initial', step: 0, productData: conversationState.productData }); // Keep user data
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מה בא לך לבדוק? יש לך מוצר ספציפי בראש?',
          quickReplies: [
            { label: 'כן, יש לי מוצר', value: 'has-specific-product' },
            { label: 'לא ממש, אשמח לעזרה', value: 'needs-help-choosing' },
          ],
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    // Handle no more products
    if (value === 'no-more-products') {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'לא, תודה',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מעולה! אני פה אם את צריכה 😊',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 800);
      return;
    }

    // Handle price submission (target_price or percent_drop)
    if (value.startsWith('price-submit:')) {
      const parts = value.substring('price-submit:'.length).split(':');
      const targetType = parts[0] as 'target_price' | 'percent_drop';
      const targetValue = parts[1];
      
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: targetType === 'target_price' ? `מחיר יעד: ₪${targetValue}` : `אחוז ירידה: ${targetValue}%`,
        source: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Store target_value and target_type in conversation state
      setConversationState(prev => ({
        ...prev,
        step: 6,
        productData: {
          ...prev.productData,
          priceTarget: targetValue,
          target_type: targetType,
          target_value: parseFloat(targetValue),
        }
      }));
      
      // Check if user is identified (has phone number)
      const hasPhone = conversationState.productData.phone;
      
      setTimeout(() => {
        if (!hasPhone) {
          // Ask for WhatsApp phone number
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 1,
              type: 'assistant',
              contentJSX: (
                <div>
                  <p className="mb-2">לאיזה מספר לשלוח לך וואטסאפ כשיש ירידת מחיר?</p>
                  <InlineInputs
                    inputs={[
                      { 
                        id: 'phone', 
                        type: 'tel', 
                        placeholder: 'מספר טלפון (לדוגמה: 0501234567)',
                        inputMode: 'tel'
                      }
                    ]}
                    submitLabel="סגור, שלחי"
                    onSubmit={(phoneValues) => {
                      handleQuickReply(`phone-submit:${phoneValues.phone}`);
                    }}
                  />
                </div>
              ),
              content: '',
              source: 'script',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
          }, 800);
        } else {
          // User already identified, show confirmation
          handleQuickReply('show-tracking-confirmation');
        }
      }, 500);
      return;
    }

    // Continue Path 1 - price target question (legacy handlers for backwards compatibility)
    else if (value === 'price-target' || value === 'price-range' || value === 'price-auto') {
      setIsTyping(true);
      setTimeout(() => {
        if (value === 'price-target') {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'assistant',
            contentJSX: (
              <div>
                <p className="mb-2">סבבה! מה המחיר שאת מכוונת אליו?</p>
                <InlineInputs
                  inputs={[
                    { id: 'priceTarget', type: 'number', placeholder: 'למשל: 2500' }
                  ]}
                  onSubmit={(values) => {
                    // Normalize priceTarget to string (number inputs always return strings)
                    const priceTargetValue = typeof values.priceTarget === 'string' 
                      ? values.priceTarget 
                      : String(values.priceTarget ?? '');
                    
                    setConversationState(prev => ({ 
                      ...prev, 
                      step: 6, 
                      productData: { ...prev.productData, priceTarget: priceTargetValue } 
                    }));
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      type: 'user',
                      content: `מחיר יעד: ₪${priceTargetValue}`,
                      timestamp: new Date(),
                    }]);
                    
                    // Check if user is identified (has phone number)
                    const hasPhone = conversationState.productData.phone;
                    
                    setTimeout(() => {
                      if (!hasPhone) {
                        // Ask for WhatsApp phone number
                        setIsTyping(true);
                        setTimeout(() => {
                          setMessages(prev => [...prev, {
                            id: Date.now() + 1,
                            type: 'assistant',
                            contentJSX: (
                              <div>
                                <p className="mb-2">לאי��ה מספר לשלוח לך וואטסאפ כשיש ירידת מחיר?</p>
                                <InlineInputs
                                  inputs={[
                                    { 
                                      id: 'phone', 
                                      type: 'tel', 
                                      placeholder: 'מספר טלפון (לדוגמה: 0501234567)',
                                      inputMode: 'tel'
                                    }
                                  ]}
                                  submitLabel="סגור, שלחי"
                                  onSubmit={(phoneValues) => {
                                    handleQuickReply(`phone-submit:${phoneValues.phone}`);
                                  }}
                                />
                              </div>
                            ),
                            content: '',
                            timestamp: new Date(),
                          }]);
                          setIsTyping(false);
                        }, 800);
                      } else {
                        // User already identified, show confirmation
                        handleQuickReply('show-tracking-confirmation');
                      }
                    }, 500);
                  }}
                />
              </div>
            ),
            content: '',
            timestamp: new Date(),
          }]);
        } else if (value === 'price-range') {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'assistant',
            contentJSX: (
              <div>
                <p className="mb-2">איזה טווח מתאים לך?</p>
                <InlineInputs
                  inputs={[
                    { id: 'priceRange', type: 'text', placeholder: 'למשל: 2000-3000' }
                  ]}
                  onSubmit={(values) => {
                    // Normalize priceRange to string (text inputs always return strings)
                    const priceRangeValue = typeof values.priceRange === 'string' 
                      ? values.priceRange 
                      : String(values.priceRange ?? '');
                    
                    setConversationState(prev => ({ 
                      ...prev, 
                      step: 6, 
                      productData: { ...prev.productData, priceTarget: priceRangeValue } 
                    }));
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      type: 'user',
                      content: `טווח מחיר: ₪${priceRangeValue}`,
                      timestamp: new Date(),
                    }]);
                    
                    // Check if user is identified (has phone number)
                    const hasPhone = conversationState.productData.phone;
                    
                    setTimeout(() => {
                      if (!hasPhone) {
                        // Ask for WhatsApp phone number
                        setIsTyping(true);
                        setTimeout(() => {
                          setMessages(prev => [...prev, {
                            id: Date.now() + 1,
                            type: 'assistant',
                            contentJSX: (
                              <div>
                                <p className="mb-2">לאיזה מספר לשלוח לך וואטסאפ כשיש ירידת מחיר?</p>
                                <InlineInputs
                                  inputs={[
                                    { 
                                      id: 'phone', 
                                      type: 'tel', 
                                      placeholder: 'מספר טלפון (לדוגמה: 0501234567)',
                                      inputMode: 'tel'
                                    }
                                  ]}
                                  submitLabel="סגור, שלחי"
                                  onSubmit={(phoneValues) => {
                                    handleQuickReply(`phone-submit:${phoneValues.phone}`);
                                  }}
                                />
                              </div>
                            ),
                            content: '',
                            timestamp: new Date(),
                          }]);
                          setIsTyping(false);
                        }, 800);
                      } else {
                        // User already identified, show confirmation
                        handleQuickReply('show-tracking-confirmation');
                      }
                    }, 500);
                  }}
                />
              </div>
            ),
            content: '',
            timestamp: new Date(),
          }]);
        } else {
          // price-auto - "תבחרי את בשבילי" - call AI to calculate price target
          const userMessage: Message = {
            id: Date.now(),
            type: 'user',
            content: 'תבחרי את בשבילי',
            source: 'user',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, userMessage]);
          
          setIsTyping(true);
          
          // Prepare product details for AI
          const productData = conversationState.productData;
          const productInfo = `
מוצר: ${productData.name || 'לא צוין'}
קטגוריה: ${productData.category || 'לא צוין'}
קישור: ${productData.link || 'לא צוין'}
תקציב: ${productData.budget || 'לא צוין'}
דרישות: ${productData.requirements || 'לא צוין'}
`.trim();
          
          const systemPrompt = 'עזור לי לחשב יעד מחיר הגיוני להנחה לפי תחום המוצר והמחיר. תן לי תשובה בפורמט: "target_type:percent_drop" או "target_type:target_price" ואחריו "target_value:מספר". למשל: "target_type:percent_drop target_value:10" או "target_type:target_price target_value:2500".';
          
          const aiMessages = [
            {
              role: 'system' as const,
              content: systemPrompt,
            },
            {
              role: 'user' as const,
              content: `פרטי המוצר:\n${productInfo}\n\nעזור לי לחשב יעד מחיר הגיוני להנחה.`,
            },
          ];
          
          const calculatePriceTarget = async () => {
            try {
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  messages: aiMessages,
                }),
              });

              if (!response.ok) {
                throw new Error('Failed to get AI response');
              }

              const data = await response.json();
              const aiContent = data.choices?.[0]?.message?.content || '';
              
              // Parse AI response to extract target_type and target_value
              let targetType: 'target_price' | 'percent_drop' = 'percent_drop';
              let targetValue = 10; // Default to 10% drop
              
              // Try to extract target_type and target_value from AI response
              const targetTypeMatch = aiContent.match(/target_type:(\w+)/i);
              const targetValueMatch = aiContent.match(/target_value:(\d+(?:\.\d+)?)/i);
              
              if (targetTypeMatch) {
                const extractedType = targetTypeMatch[1].toLowerCase();
                if (extractedType === 'target_price' || extractedType === 'percent_drop') {
                  targetType = extractedType;
                }
              }
              
              if (targetValueMatch) {
                targetValue = parseFloat(targetValueMatch[1]);
              }
              
              // Store in conversation state
              setConversationState(prev => ({
                ...prev,
                step: 6,
                productData: {
                  ...prev.productData,
                  priceTarget: targetValue.toString(),
                  target_type: targetType,
                  target_value: targetValue,
                }
              }));
              
              // Show AI response to user
              setIsTyping(false);
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: Date.now() + 1,
                  type: 'assistant',
                  content: `מעולה! קבעתי לך יעד של ${targetType === 'target_price' ? `₪${targetValue}` : `${targetValue}% הנחה`}. אני אעקוב אחרי זה ואעדכן אותך כשיהיה התאמה.`,
                  source: 'ai',
                  timestamp: new Date(),
                }]);
                
                // Check if user is identified (has phone number)
                const hasPhone = conversationState.productData.phone;
                
                setTimeout(() => {
                  if (!hasPhone) {
                    // Ask for WhatsApp phone number
                    setIsTyping(true);
                    setTimeout(() => {
                      setMessages(prev => [...prev, {
                        id: Date.now() + 2,
                        type: 'assistant',
                        contentJSX: (
                          <div>
                            <p className="mb-2">לאיזה מספר לשלוח לך וואטסאפ כשיש ירידת מחיר?</p>
                            <InlineInputs
                              inputs={[
                                { 
                                  id: 'phone', 
                                  type: 'tel', 
                                  placeholder: 'מספר טלפון (לדוגמה: 0501234567)',
                                  inputMode: 'tel'
                                }
                              ]}
                              submitLabel="סגור, שלחי"
                              onSubmit={(phoneValues) => {
                                handleQuickReply(`phone-submit:${phoneValues.phone}`);
                              }}
                            />
                          </div>
                        ),
                        content: '',
                        source: 'script',
                        timestamp: new Date(),
                      }]);
                      setIsTyping(false);
                    }, 800);
                  } else {
                    // User already identified, show confirmation
                    handleQuickReply('show-tracking-confirmation');
                  }
                }, 1000);
              }, 800);
            } catch (error) {
              console.error('Error calling AI API for price target:', error);
              setIsTyping(false);
              // Fallback to default 10% drop on error
              setConversationState(prev => ({
                ...prev,
                step: 6,
                productData: {
                  ...prev.productData,
                  priceTarget: '10',
                  target_type: 'percent_drop',
                  target_value: 10,
                }
              }));
              
              setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'assistant',
                content: 'קבעתי לך יעד של 10% הנחה. אני אעקוב אחרי זה ואעדכן אותך כשיהיה התאמה.',
                source: 'script',
                timestamp: new Date(),
              }]);
              
              // Continue with phone collection
              const hasPhone = conversationState.productData.phone;
              if (!hasPhone) {
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setMessages(prev => [...prev, {
                      id: Date.now() + 2,
                      type: 'assistant',
                      contentJSX: (
                        <div>
                          <p className="mb-2">לאיזה מספר לשלוח לך וואטסאפ כשיש ירידת מחיר?</p>
                          <InlineInputs
                            inputs={[
                              { 
                                id: 'phone', 
                                type: 'tel', 
                                placeholder: 'מספר טלפון (לדוגמה: 0501234567)',
                                inputMode: 'tel'
                              }
                            ]}
                            submitLabel="סגור, שלחי"
                            onSubmit={(phoneValues) => {
                              handleQuickReply(`phone-submit:${phoneValues.phone}`);
                            }}
                          />
                        </div>
                      ),
                      content: '',
                      source: 'script',
                      timestamp: new Date(),
                    }]);
                    setIsTyping(false);
                  }, 800);
                }, 500);
              } else {
                handleQuickReply('show-tracking-confirmation');
              }
            }
          };
          
          calculatePriceTarget();
        }
        setIsTyping(false);
      }, 800);
    }

    // Final confirmation - with WhatsApp phone collection
    else if (value === 'track-now' || value === 'track-sales') {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'סבבה, פותחת לך מעקב 🙂\nאשלח וואטסאפ ברגע שיש באמת הזדמנות שווה.',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        setConversationState(prev => ({ ...prev, step: 6, productData: { ...prev.productData, timing: value } }));

        // Ask for WhatsApp phone number
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              contentJSX: (
                <div>
                  <p className="mb-1">רק עוד שנייה ואני על זה 👀</p>
                  <p className="mb-2">לאיזה מספר לשלוח לך וואטסאפ כשיש ירידת מחיר?</p>
                  <p className="text-xs text-gray-500 mb-2">בלי ספאם, רק כשזה באמת משתלם.</p>
                  <InlineInputs
                    inputs={[
                      { 
                        id: 'phone', 
                        type: 'tel', 
                        placeholder: 'מספר טלפון (לדוגמה: 0501234567)',
                        inputMode: 'tel'
                      }
                    ]}
                    submitLabel="סגור, שלחי"
                    onSubmit={(values) => {
                      // Safely handle phone value - ensure it's a string before calling .replace()
                      if (typeof values.phone !== 'string') {
                        return; // Early return if phone is not a string (shouldn't happen for tel input)
                      }
                      
                      const phone = values.phone.replace(/\s/g, '');
                      const isValidIsraeliPhone = /^05\d{8}$/.test(phone);
                      
                      if (!isValidIsraeliPhone) {
                        setMessages(prev => [...prev, {
                          id: Date.now(),
                          type: 'assistant',
                          contentJSX: (
                            <div>
                              <p className="mb-2">נראה לי שהמספר קצת קצר 😅</p>
                              <p className="mb-2">בא לך לבדוק שוב?</p>
                              <InlineInputs
                                inputs={[{ id: 'phone', type: 'tel', placeholder: 'מספר טלפון (לדוגמה: 0501234567)', inputMode: 'tel' }]}
                                submitLabel="סגור, שלחי"
                                onSubmit={(retryValues) => {
                                  // Safely handle phone value - ensure it's a string before calling .replace()
                                  if (typeof retryValues.phone !== 'string') {
                                    return; // Early return if phone is not a string (shouldn't happen for tel input)
                                  }
                                  
                                  const retryPhone = retryValues.phone.replace(/\s/g, '');
                                  const maskedPhone = retryPhone.slice(0, 3) + '***' + retryPhone.slice(-4);
                                  setConversationState(prev => ({ ...prev, step: 7, productData: { ...prev.productData, phone: retryPhone } }));
                                  setMessages(prev => [...prev, { id: Date.now(), type: 'user', content: maskedPhone, timestamp: new Date() }]);
                                  setTimeout(() => {
                                    setIsTyping(true);
                                    setTimeout(() => {
                                      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'assistant', content: 'מעולה 🙌\nשמרתי. אני אקפוץ לוואטסאפ ברגע שיש משהו ששווה לעצור בשבילו.', timestamp: new Date() }]);
                                      setIsTyping(false);
                                      setConversationState(prev => ({ ...prev, step: 8 }));
                                      
                                      // Ask for first name
                                      setTimeout(() => {
                                        setIsTyping(true);
                                        setTimeout(() => {
                                          const nameRequest = createNameRequestMessage((firstName) => {
                                            setConversationState(prev => ({ ...prev, step: 9, productData: { ...prev.productData, firstName } }));
                                            createNameConfirmationSequence(firstName, setMessages, setIsTyping, !isLoggedIn, handleQuickReply);
                                          });
                                          setMessages(prev => [...prev, nameRequest]);
                                          setIsTyping(false);
                                        }, 800);
                                      }, 1200);
                                    }, 800);
                                  }, 500);
                                }}
                              />
                            </div>
                          ),
                          content: 'נראה לי שהמספר קצת קצר 😅\nבא לך לבדוק שוב?',
                          timestamp: new Date(),
                        }]);
                        return;
                      }
                      
                      const maskedPhone = phone.slice(0, 3) + '***' + phone.slice(-4);
                      setConversationState(prev => ({ ...prev, step: 7, productData: { ...prev.productData, phone: phone } }));
                      setMessages(prev => [...prev, { id: Date.now(), type: 'user', content: maskedPhone, timestamp: new Date() }]);
                      
                      setTimeout(() => {
                        setIsTyping(true);
                        setTimeout(() => {
                          setMessages(prev => [...prev, { id: Date.now() + 1, type: 'assistant', content: 'מעולה 🙌\nשמרתי. אני אקפוץ לוואטסאפ ברגע שיש משהו ששווה לעצור בשבילו.', timestamp: new Date() }]);
                          setIsTyping(false);
                          setConversationState(prev => ({ ...prev, step: 8 }));
                          
                          // Ask for first name
                          setTimeout(() => {
                            setIsTyping(true);
                            setTimeout(() => {
                              const nameRequest = createNameRequestMessage((firstName) => {
                                setConversationState(prev => ({ ...prev, step: 9, productData: { ...prev.productData, firstName } }));
                                createNameConfirmationSequence(firstName, setMessages, setIsTyping, !isLoggedIn, handleQuickReply);
                              });
                              setMessages(prev => [...prev, nameRequest]);
                              setIsTyping(false);
                            }, 800);
                          }, 1200);
                        }, 800);
                      }, 500);
                    }}
                  />
                </div>
              ),
              content: '',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
          }, 1000);
        }, 1200);
      }, 800);
    }

    // Account creation - Yes
    else if (value === 'create-account-yes') {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsLoggedIn(true);
          const accountMessages = createAccountCreatedMessage(() => {
            setCurrentPage('account');
          });
          setMessages(prev => [...prev, ...accountMessages]);
          setIsTyping(false);
          setConversationState(prev => ({ ...prev, step: 10 }));
          
          // Increment completed trackings count
          const newCount = completedTrackingsCount + 1;
          setCompletedTrackingsCount(newCount);
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              // Check if user has reached the 3 tracking limit
              if (newCount >= 3) {
                // Show premium limit message
                setMessages(prev => [...prev, {
                  id: Date.now() + 10,
                  type: 'assistant',
                  content: 'הגעת לתקרה של שלושה 😌\nהייתי עוקבת לך גם אחרי רשימת חתונה אם הייתי יכולה 😅\n\nאבל באיזשהו שלב אני צריכה שגם לי יצא איזה ש״ח מהסיפור…',
                  timestamp: new Date(),
                }]);
                setIsTyping(false);
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setMessages(prev => [...prev, {
                      id: Date.now() + 11,
                      type: 'assistant',
                      content: 'איך בא לך להמשיך?',
                      timestamp: new Date(),
                    }]);
                    setIsTyping(false);
                    
                    // Show premium options after a brief pause
                    setTimeout(() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setMessages(prev => [...prev, {
                          id: Date.now() + 12,
                          type: 'assistant',
                          content: '',
                          contentJSX: (
                            <div className="space-y-3">
                              <button 
                                onClick={() => handleQuickReply('premium-monthly')}
                                className="flex items-start gap-3 w-full bg-white hover:bg-gray-50 text-right border-2 border-gray-200 px-4 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                              >
                                <span className="text-2xl flex-shrink-0">🔵</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1">פרימיום חודשי</div>
                                  <div className="text-sm text-gray-600">בלי התחייבות. נתחיל בקטן.</div>
                                </div>
                              </button>
                              
                              <button 
                                onClick={() => handleQuickReply('premium-yearly')}
                                className="flex items-start gap-3 w-full bg-white hover:bg-gray-50 text-right border-2 border-gray-200 px-4 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                              >
                                <span className="text-2xl flex-shrink-0">🟣</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1">פרימיום שנתי</div>
                                  <div className="text-sm text-gray-600">חוסך יותר, אם את כבר יודעת שאת בעניין.</div>
                                </div>
                              </button>
                              
                              <button 
                                onClick={() => handleQuickReply('premium-not-now')}
                                className="flex items-start gap-3 w-full bg-white hover:bg-gray-50 text-right border-2 border-gray-200 px-4 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                              >
                                <span className="text-2xl flex-shrink-0">⏸️</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1">לא עכשיו</div>
                                  <div className="text-sm text-gray-600">הכל טוב. נישאר עם מה שכבר עוקבים 👌</div>
                                </div>
                              </button>
                            </div>
                          ),
                          timestamp: new Date(),
                        }]);
                        setIsTyping(false);
                      }, 800);
                    }, 1000);
                  }, 800);
                }, 1200);
              } else {
                // Show normal "add another product" message
                setMessages(prev => [...prev, {
                  id: Date.now() + 10,
                  type: 'assistant',
                  content: 'ובינתיים, אם בא לך – אפשר לבדוק עוד מוצר 😉',
                  timestamp: new Date(),
                }]);
                setIsTyping(false);
              setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                  setMessages(prev => [...prev, {
                    id: Date.now() + 11,
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
              }
            }, 800);
          }, 1500);
        }, 800);
      }, 500);
    }
    
    // Account creation - No
    else if (value === 'create-account-no') {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const declineMessage = createAccountDeclinedMessage();
          setMessages(prev => [...prev, declineMessage]);
          setIsTyping(false);
          setConversationState(prev => ({ ...prev, step: 10 }));
          
          // Increment completed trackings count
          const newCount2 = completedTrackingsCount + 1;
          setCompletedTrackingsCount(newCount2);
          
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              // Check if user has reached the 3 tracking limit
              if (newCount2 >= 3) {
                // Show premium limit message
                setMessages(prev => [...prev, {
                  id: Date.now() + 2,
                  type: 'assistant',
                  content: 'הגעת לתקרה של שלושה 😌\nהייתי עוקבת לך גם אחרי רשימת חתונה אם הייתי יכולה 😅\n\nאבל באיזשהו שלב אני צריכה שגם לי יצא איזה ש״ח מהסיפור…',
                  timestamp: new Date(),
                }]);
                setIsTyping(false);
                setTimeout(() => {
                  setIsTyping(true);
                  setTimeout(() => {
                    setMessages(prev => [...prev, {
                      id: Date.now() + 3,
                      type: 'assistant',
                      content: 'איך בא לך להמשיך?',
                      timestamp: new Date(),
                    }]);
                    setIsTyping(false);
                    
                    // Show premium options after a brief pause
                    setTimeout(() => {
                      setIsTyping(true);
                      setTimeout(() => {
                        setMessages(prev => [...prev, {
                          id: Date.now() + 4,
                          type: 'assistant',
                          content: '',
                          contentJSX: (
                            <div className="space-y-3">
                              <button 
                                onClick={() => handleQuickReply('premium-monthly')}
                                className="flex items-start gap-3 w-full bg-white hover:bg-gray-50 text-right border-2 border-gray-200 px-4 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                              >
                                <span className="text-2xl flex-shrink-0">🔵</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1">פרימיום חודשי</div>
                                  <div className="text-sm text-gray-600">בלי התחייבות. נתחיל בקטן.</div>
                                </div>
                              </button>
                              
                              <button 
                                onClick={() => handleQuickReply('premium-yearly')}
                                className="flex items-start gap-3 w-full bg-white hover:bg-gray-50 text-right border-2 border-gray-200 px-4 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                              >
                                <span className="text-2xl flex-shrink-0">🟣</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1">פרימיום שנתי</div>
                                  <div className="text-sm text-gray-600">חוסך יותר, אם את כבר יודעת שאת בעניין.</div>
                                </div>
                              </button>
                              
                              <button 
                                onClick={() => handleQuickReply('premium-not-now')}
                                className="flex items-start gap-3 w-full bg-white hover:bg-gray-50 text-right border-2 border-gray-200 px-4 py-4 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                              >
                                <span className="text-2xl flex-shrink-0">⏸️</span>
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 mb-1">לא עכשיו</div>
                                  <div className="text-sm text-gray-600">הכל טוב. נישאר עם מה שכבר עוקבים 👌</div>
                                </div>
                              </button>
                            </div>
                          ),
                          timestamp: new Date(),
                        }]);
                        setIsTyping(false);
                      }, 800);
                    }, 1000);
                  }, 800);
                }, 1200);
              } else {
                // Show normal "add another product" message
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
                  
                  // Show login suggestion after a pause
                  setTimeout(() => {
                    showLoginSuggestion();
                  }, 2000);
                }, 1000);
              }, 1200);
              }
            }, 800);
          }, 1500);
        }, 800);
      }, 500);
    }

    // Login suggestion - Yes
    else if (value === 'login-suggestion-yes') {
      // Open login flow
      setOtpReturnPage('chat');
      setCurrentPage('login');
    }

    // Login suggestion - No
    else if (value === 'login-suggestion-no') {
      // Just continue normally - no response needed
      // The suggestion won't show again this session
    }

    // Premium - Not Now
    else if (value === 'premium-not-now') {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'לא עכשיו',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'סגור לגמרי.\nשלושה מעקבים חינם זה עדיין ממש לא מעט 😉\nכשתרצי להוסיף עוד – אני פה.',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 800);
    }

    // Premium - Monthly
    else if (value === 'premium-monthly') {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'פרימיום חודשי',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'יאללה, מנוי חודשי 👍\nרגע לפני התשלום – חשוב שתדעי:',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              contentJSX: (
                <div className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div>• אפשר לבטל מתי שרוצים, בלי דמי ביטול.</div>
                    <div>• הביטול נעשה דרך האזור האישי.</div>
                    <div>• אם מבטלים – המעקבים שנוספו במסגרת הפרימיום מפסיקים.<br />
                      <span className="mr-2">שלושת המעקבים הראשונים תמיד נשארים.</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleQuickReply('proceed-to-payment-monthly')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    להמשך לתשלום
                  </button>
                </div>
              ),
              content: '',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
          }, 800);
        }, 1000);
      }, 800);
    }

    // Premium - Yearly
    else if (value === 'premium-yearly') {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: 'פרימיום שנתי',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מעולה, הולכות על שנתי 💜\nרגע לפני התשלום – חשוב שתדעי:',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              type: 'assistant',
              contentJSX: (
                <div className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div>• אפשר לבטל מתי שרוצים, בלי דמי ביטול.</div>
                    <div>• הביטול נעשה דרך האזור האישי.</div>
                    <div>• אם מבטלים – המעקבים שנוספו במסגרת הפרימיום מפסיקים.<br />
                      <span className="mr-2">שלושת המעקבים הראשונים תמיד נשארים.</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleQuickReply('proceed-to-payment-yearly')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    להמשך לתשלום
                  </button>
                </div>
              ),
              content: '',
              timestamp: new Date(),
            }]);
            setIsTyping(false);
          }, 800);
        }, 1000);
      }, 800);
    }

    // Proceed to payment - Monthly
    else if (value === 'proceed-to-payment-monthly') {
      setSelectedPremiumPlan('monthly');
      setCurrentPage('payment');
    }

    // Proceed to payment - Yearly
    else if (value === 'proceed-to-payment-yearly') {
      setSelectedPremiumPlan('yearly');
      setCurrentPage('payment');
    }

    // Default fallback
    else {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'assistant',
          content: 'מעולה! בואי נתחיל.\n\nשלחי לי קישור למוצר או ספרי לי מה את מחפשת 🔍',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleTabChange = (tab: 'chat' | 'deals') => {
    setActiveTab(tab);
    if (tab === 'deals') {
      // Mark all deals as read
      setDeals(prev => prev.map(deal => ({ ...deal, isRead: true })));
    }
    // Reset scroll states when switching tabs
    setDealsScrolled(false);
    if (tab === 'chat') {
      setIsTabsCollapsed(false);
    }
  };

  const handlePauseTracking = (dealId: number) => {
    setDeals(prev => 
      prev.map(deal => 
        deal.id === dealId 
          ? { ...deal, status: 'paused' as const, pausedAt: new Date() }
          : deal
      )
    );
    setActiveOverflowMenu(null);
    setShowPauseConfirmation(null);
  };

  const handleRemoveTracking = (dealId: number) => {
    setDeals(prev => prev.filter(deal => deal.id !== dealId));
    setActiveOverflowMenu(null);
    setShowRemoveConfirmation(null);
  };

  const handleDealsIconClick = () => {
    if (deals.length > 0) {
      handleTabChange('deals');
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `לפני ${diffMins} דקות`;
    } else if (diffHours < 24) {
      return `לפני ${diffHours} שעות`;
    } else {
      return `לפני ${diffDays} ימים`;
    }
  };

  // Hebrew date formatting for chat timeline (WhatsApp-style)
  const formatChatDate = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Today
    if (diffDays === 0) {
      return 'היום';
    }

    // Yesterday
    if (diffDays === 1) {
      return 'אתמול';
    }

    // Last 7 days - show day name
    if (diffDays < 7) {
      const dayNames = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת'];
      return dayNames[date.getDay()];
    }

    // Older than 7 days - show full date
    const dayNames = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'יום שבת'];
    const monthNames = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    
    return `${dayName}, ${day} ב${month}`;
  };

  // Check if two dates are on different days
  const isDifferentDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() !== date2.getDate() ||
           date1.getMonth() !== date2.getMonth() ||
           date1.getFullYear() !== date2.getFullYear();
  };

  const unreadDealsCount = deals.filter(deal => !deal.isRead).length;
  const hasDeals = deals.length > 0;
  
  // Filter deals based on selected filter
  const filteredDeals = deals.filter(deal => {
    if (dealsFilter === 'active') return deal.status === 'active' || deal.status === 'paused';
    if (dealsFilter === 'expired') return deal.status === 'expired';
    return true; // 'all'
  });
  
  const activeDealsCount = deals.filter(deal => deal.status === 'active' || deal.status === 'paused').length;
  const expiredDealsCount = deals.filter(deal => deal.status === 'expired').length;

  // Render content for the current page
  const renderPageContent = () => {
    if (currentPage === 'about') {
      return <AboutPage onClose={() => setCurrentPage('chat')} onNavigateToWhat={() => setCurrentPage('what')} isDesktop={isDesktop} />;
    }
    if (currentPage === 'what') {
      return <WhatPage onClose={() => setCurrentPage('chat')} isDesktop={isDesktop} />;
    }
    if (currentPage === 'contact') {
      return <ContactPage onClose={() => setCurrentPage('chat')} isDesktop={isDesktop} />;
    }
    if (currentPage === 'ui-foundations') {
      return <UIFoundationsPage onClose={() => setCurrentPage('chat')} />;
    }
    return null;
  };

  return (
    <>
      <CookieConsent />
      
      {!isDesktop && currentPage === 'about' && <AboutPage onClose={() => setCurrentPage('chat')} onNavigateToWhat={() => setCurrentPage('what')} isDesktop={isDesktop} />}
      {!isDesktop && currentPage === 'what' && <WhatPage onClose={() => setCurrentPage('chat')} isDesktop={isDesktop} />}
      {!isDesktop && currentPage === 'how' && <HowPage onBack={() => setCurrentPage('chat')} isDesktop={isDesktop} />}
      {!isDesktop && currentPage === 'contact' && <ContactPage onClose={() => setCurrentPage('chat')} isDesktop={isDesktop} />}
      {!isDesktop && currentPage === 'profile' && (
        <ProfilePage 
          onBack={() => setCurrentPage('chat')}
          firstName={conversationState.productData.firstName}
          phoneNumber={conversationState.productData.phone}
          onUpdateName={(newName) => {
            setConversationState(prev => ({
              ...prev,
              productData: { ...prev.productData, firstName: newName }
            }));
          }}
          onUpdatePhone={(newPhone) => {
            setConversationState(prev => ({
              ...prev,
              productData: { ...prev.productData, phone: newPhone }
            }));
          }}
          onUpgradeToPremium={() => setCurrentPage('premium-selection')}
          isPremium={isPremiumUser}
          subscriptionType={selectedPremiumPlan || undefined}
          renewalDate={
            premiumStartDate && selectedPremiumPlan
              ? (() => {
                  const renewalDate = new Date(premiumStartDate);
                  if (selectedPremiumPlan === 'monthly') {
                    renewalDate.setMonth(renewalDate.getMonth() + 1);
                  } else {
                    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                  }
                  return renewalDate.toLocaleDateString('he-IL');
                })()
              : undefined
          }
          activeTrackings={deals.filter(d => d.status === 'active').length}
          onCancelSubscription={() => {
            setIsPremiumUser(false);
            setSelectedPremiumPlan(null);
            setPremiumStartDate(null);
          }}
          isDesktop={isDesktop}
        />
      )}
      {!isDesktop && currentPage === 'trackings' && (
        <TrackingsPage 
          onBack={() => setCurrentPage('chat')}
          deals={deals}
        />
      )}
      
      {!isDesktop && currentPage === 'privacy' && <PrivacyPage onClose={() => setCurrentPage('chat')} />}
      {!isDesktop && currentPage === 'terms' && <TermsPage onClose={() => setCurrentPage('chat')} />}
      {currentPage === 'demo' && <ImageUploaderDemo onClose={() => setCurrentPage('chat')} />}
      {!isDesktop && currentPage === 'accessibility' && <AccessibilityPage onClose={() => setCurrentPage('chat')} />}
      {!isDesktop && currentPage === 'accessibility-statement' && <AccessibilityStatementPage onClose={() => setCurrentPage('chat')} />}
      {currentPage === 'ui-foundations' && <UIFoundationsPage onClose={() => setCurrentPage('chat')} />}
      {currentPage === 'login' && (
        <LoginPage 
          onClose={() => setCurrentPage('chat')} 
          onSendOTP={(phone) => {
            setOtpPhone(phone);
            setOtpReturnPage('chat');
            setCurrentPage('otp');
          }}
        />
      )}
      {currentPage === 'otp' && (
        <OTPVerification
          phoneNumber={otpPhone}
          onClose={() => setCurrentPage(otpReturnPage === 'account' ? 'account' : 'login')}
          onVerify={(code) => {
            // Check if user has existing conversation
            const hasExistingConversation = messages.length > 2;
            
            setIsLoggedIn(true);
            
            // If returning user with conversation, show welcome-back message when they return to chat
            if (hasExistingConversation && otpReturnPage === 'chat') {
              setShouldShowWelcomeBack(true);
            }
            
            // Return to the page that initiated OTP
            setCurrentPage(otpReturnPage);
            // Reset for next time
            setOtpReturnPage('chat');
          }}
          onResend={() => {
            // Simulate resend
            console.log('Resending OTP to:', otpPhone);
          }}
        />
      )}
      {!isDesktop && currentPage === 'account' && (
        <AccountPage 
          onClose={() => setCurrentPage('chat')}
          firstName={conversationState.productData.firstName}
          phoneNumber={otpPhone}
          isDesktop={isDesktop}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentPage('chat');
            // Add logout message to chat
            const logoutMessage: Message = {
              id: messages.length + 1,
              type: 'assistant',
              content: 'נותקנו 🙂\nכשתרצי לחזור – אני פה.',
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, logoutMessage]);
          }}
          onEditPhone={() => {
            // Navigate to OTP for phone verification
            setOtpReturnPage('account');
            setCurrentPage('otp');
          }}
          onUpdateName={(newName) => {
            setConversationState(prev => ({
              ...prev,
              productData: {
                ...prev.productData,
                firstName: newName
              }
            }));
          }}
          trackings={deals.map(deal => ({
            id: deal.id,
            productName: deal.productName,
            status: deal.status
          }))}
          onNavigateToTrackings={() => {
            setCurrentPage('chat');
            setDealsFilter('active'); // Always open with 'פעילים' tab when entering from Personal Area
            handleTabChange('deals');
          }}
        />
      )}
      {!isDesktop && currentPage === 'settings' && (
        <SettingsPage 
          onClose={() => setCurrentPage('chat')}
          isDesktop={isDesktop}
        />
      )}

      {currentPage === 'payment' && selectedPremiumPlan && (
        <PaymentPage 
          plan={selectedPremiumPlan}
          onBack={() => setCurrentPage('premium-selection')}
          onSuccess={() => {
            // Set premium user status
            setIsPremiumUser(true);
            setPremiumStartDate(new Date());
            
            setCurrentPage('chat');
            // Add success message to chat
            setTimeout(() => {
              setIsTyping(true);
              setTimeout(() => {
                setMessages(prev => [...prev, {
                  id: Date.now(),
                  type: 'assistant',
                  content: 'סגור 🎉\nאני חוזרת לעקוב בלי הגבלה.\nעל מה בא לך שנשים מעקב עכשיו?',
                  timestamp: new Date(),
                }]);
                setIsTyping(false);
              }, 800);
            }, 300);
          }}
        />
      )}

      {currentPage === 'premium-selection' && (
        <PremiumSelectionPage 
          onBack={() => setCurrentPage('profile')}
          onContinueToPayment={(plan) => {
            setSelectedPremiumPlan(plan);
            setCurrentPage('payment');
          }}
        />
      )}
      
      {/* Desktop layout with fixed header for main pages + Mobile chat */}
      {((isDesktop && !['demo', 'ui-foundations', 'login', 'otp', 'premium-selection', 'payment'].includes(currentPage)) || (!isDesktop && currentPage === 'chat')) && (
    <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden" dir="rtl">
      {/* Header - minimal */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo/Brand - clickable to return to chat */}
          <button 
            onClick={() => setCurrentPage('chat')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <img
                src={oshiyaAvatar}
                alt="אושייה"
                className="w-14 h-14 rounded-full object-cover object-center border-2 border-purple-300"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">אושיית שופינג</h1>
              <p className="text-xs text-gray-500 leading-tight text-right">
                אני לא מחפשת מבצעים.<br />אני מחכה להזדמנות.
              </p>
            </div>
          </button>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-1">
            {/* צ'אט - ללא דרופדאון */}
            <button 
              onClick={() => setCurrentPage('chat')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'chat' 
                  ? 'text-purple-700 bg-purple-50' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>צ'אט</span>
            </button>

            {/* האזור שלי - דרופדאון */}
            {isLoggedIn && (
              <div 
                className="relative dropdown-container"
              >
                <button 
                  onClick={() => setOpenDropdown(openDropdown === 'myArea' ? null : 'myArea')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentPage === 'account' || currentPage === 'settings' || currentPage === 'profile'
                      ? 'text-purple-700 bg-purple-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>האזור שלי</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                {openDropdown === 'myArea' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        setCurrentPage('profile');
                        setOpenDropdown(null);
                      }}
                      className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>הפרופיל שלי</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('chat');
                        setActiveTab('deals');
                        setOpenDropdown(null);
                      }}
                      className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>המעקבים שלי</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage('settings');
                        setOpenDropdown(null);
                      }}
                      className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>ההגדרות שלי</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* אושייה - דרופדאון */}
            <div 
              className="relative dropdown-container"
            >
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'oshiya' ? null : 'oshiya')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'about' || currentPage === 'what' || currentPage === 'how' || currentPage === 'contact'
                    ? 'text-purple-700 bg-purple-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>אושייה</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {openDropdown === 'oshiya' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setCurrentPage('about');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    <span>מי אני</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('what');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>מה אני</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('how');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>איך אני עובדת</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('contact');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>לדבר איתי</span>
                  </button>
                </div>
              )}
            </div>

            {/* דברים שחייב - דרופדאון */}
            <div 
              className="relative dropdown-container"
            >
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'must' ? null : 'must')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'privacy' || currentPage === 'terms' || currentPage === 'accessibility' || currentPage === 'accessibility-statement'
                    ? 'text-purple-700 bg-purple-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>דברים שחייב</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {openDropdown === 'must' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setCurrentPage('terms');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    <span>תנאי שימוש</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('privacy');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Cookie className="w-4 h-4" />
                    <span>פרטיות ועוגיות</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPage('accessibility');
                      setOpenDropdown(null);
                    }}
                    className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>הצהרת נגישות</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile hamburger button */}
          <button
            onClick={() => {
              if (isMenuOpen) {
                setIsMenuClosing(true);
                setTimeout(() => {
                  setIsMenuOpen(false);
                  setIsMenuClosing(false);
                }, 400);
              } else {
                setIsMenuOpen(true);
                setIsMenuOpening(true);
                setTimeout(() => {
                  setIsMenuOpening(false);
                }, 10);
              }
            }}
            className="md:hidden p-2.5 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="תפריט"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      {(isMenuOpen || isMenuClosing || isMenuOpening) && (
        <>
          {/* Overlay */}
          <div 
            className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 ${
              isMenuClosing ? 'opacity-0' : 'opacity-100'
            }`}
            onClick={() => {
              setIsMenuClosing(true);
              setTimeout(() => {
                setIsMenuOpen(false);
                setIsMenuClosing(false);
              }, 400);
            }}
          ></div>
          
          {/* Menu panel */}
          <div 
            className={`md:hidden fixed top-0 left-0 bottom-0 w-full bg-white z-50 shadow-2xl transition-transform duration-500 ease-in-out ${
              isMenuOpening 
                ? '-translate-x-full' 
                : isMenuClosing 
                  ? '-translate-x-full' 
                  : 'translate-x-0'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Menu header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img
                    src={oshiyaAvatar}
                    alt="Oshiya"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
                  />
                  <div>
                    <h2 className="font-bold text-gray-900">Oshiya</h2>
                    <p className="text-xs text-gray-500">תפריט</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMenuClosing(true);
                    setTimeout(() => {
                      setIsMenuOpen(false);
                      setIsMenuClosing(false);
                    }, 400);
                  }}
                  className="p-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Menu items */}
              <nav className="flex-1 py-4 overflow-y-auto">
                {/* Category 1: האיזור שלי */}
                <div className="mb-4">
                  <h3 className="px-6 py-2 text-xs font-normal text-gray-400 uppercase tracking-wider">האיזור שלי</h3>
                  {isLoggedIn ? (
                    <>
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          setCurrentPage('profile');
                        }}
                        className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                      >
                        הפרופיל שלי
                      </button>
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          setCurrentPage('chat');
                          setActiveTab('deals');
                        }}
                        className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right relative"
                      >
                        המעקבים שלי
                        {activeDealsCount > 0 && (
                          <span className="mr-2 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {activeDealsCount}
                          </span>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setIsMenuOpen(false);
                          setCurrentPage('settings');
                        }}
                        className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                      >
                        ההגדרות שלי
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setCurrentPage('login');
                      }}
                      className="flex items-center justify-between px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                    >
                      <span>התחברות</span>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">חדש</span>
                    </button>
                  )}
                </div>

                {/* Category 2: אושייה */}
                <div className="mb-4 mt-6">
                  <h3 className="px-6 py-2 text-xs font-normal text-gray-400 uppercase tracking-wider">אושייה</h3>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentPage('about');
                    }}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                  >
                    מי אני
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentPage('what');
                    }}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                  >
                    מה אני
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentPage('how');
                    }}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                  >
                    איך אני עובדת
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentPage('contact');
                    }}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                  >
                    לדבר איתי
                  </button>
                </div>

                {/* Category 3: דברים שחייב */}
                <div className="mb-4 mt-6">
                  <h3 className="px-6 py-2 text-xs font-normal text-gray-400 uppercase tracking-wider">דברים שחייב</h3>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentPage('terms');
                    }}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                  >
                    תנאי שימוש
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentPage('privacy');
                    }}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                  >
                    פרטיות ועוגיות
                  </button>
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      setCurrentPage('accessibility-statement');
                    }}
                    className="flex items-center px-6 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-right"
                  >
                    הצהרת נגישות
                  </button>
                </div>
              </nav>

              {/* Menu footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-center text-gray-600">
                  אני לא מחפשת מבצעים.<br />אני מחכה להזדמנות.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Chat content - only show when on chat page */}
      {currentPage === 'chat' && (
      <>
      {/* Chat messages - scrollable */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-br from-purple-50 to-pink-50"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Floating date indicator */}
        {showFloatingDate && floatingDate && activeTab === 'chat' && (
          <div 
            className="fixed top-28 md:top-32 left-1/2 transform -translate-x-1/2 z-[5] pointer-events-none"
            style={{ 
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div 
              className="px-4 py-2 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(45, 45, 45, 0.92)',
                color: 'white'
              }}
            >
              {floatingDate}
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Sticky header wrapper for Trackings page */}
          {activeTab === 'deals' && deals.length > 0 && (
            <div className="sticky top-0 bg-gradient-to-br from-purple-50 to-pink-50 -mx-4 z-10">
              {/* Primary tabs */}
              <div className="px-4 pt-1 pb-1">
                <div className={`bg-white/95 backdrop-blur-sm rounded-full border border-gray-200 transition-all duration-300 ${
                  isTabsCollapsed 
                    ? 'p-0.5' 
                    : 'p-1'
                }`}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTabChange('chat')}
                      className={`flex-1 rounded-full transition-all duration-200 focus:outline-none relative ${
                        isTabsCollapsed ? 'px-3 py-1.5' : 'px-4 py-2'
                      } text-gray-500 hover:bg-gray-50`}
                      aria-label="לחזור לצ'אט"
                    >
                      צ׳אט
                    </button>
                    <button
                      onClick={() => handleTabChange('deals')}
                      className={`flex-1 rounded-full transition-all duration-200 relative focus:outline-none ${
                        isTabsCollapsed ? 'px-3 py-1.5' : 'px-4 py-2'
                      } ${
                        activeTab === 'deals'
                          ? 'text-[#2d2d2d] bg-gray-100 font-medium'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                      aria-label="לראות את המעקבים שלך"
                    >
                      המעקבים שלי
                      {unreadDealsCount > 0 && activeTab === 'chat' && (
                        <span className="absolute -top-1 -left-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" aria-label={`${unreadDealsCount} מבצעים חדשים`}>
                          {unreadDealsCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="px-4 border-b border-gray-200">
                <div className={`flex gap-6 justify-center transition-all duration-300 ${
                  dealsScrolled ? 'py-2 pb-2.5' : 'py-3 pb-3.5'
                }`}>
                  <button
                    onClick={() => setDealsFilter('active')}
                    className={`relative focus:outline-none transition-all duration-300 ${
                      dealsScrolled ? 'text-sm' : 'text-base'
                    } ${
                      dealsFilter === 'active'
                        ? 'text-[#2d2d2d] font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                    aria-label="להציג רק מבצעים פעילים"
                  >
                    <span>פעילים</span>
                    {activeDealsCount > 0 && (
                      <span className="mr-1.5">({activeDealsCount})</span>
                    )}
                    {dealsFilter === 'active' && (
                      <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-purple-600 rounded-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setDealsFilter('expired')}
                    className={`relative focus:outline-none transition-all duration-300 ${
                      dealsScrolled ? 'text-sm' : 'text-base'
                    } ${
                      dealsFilter === 'expired'
                        ? 'text-[#2d2d2d] font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                    aria-label="להציג רק מבצעים שפג תוקפם"
                  >
                    פג תוקף
                    {dealsFilter === 'expired' && (
                      <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-purple-600 rounded-full"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setDealsFilter('all')}
                    className={`relative focus:outline-none transition-all duration-300 ${
                      dealsScrolled ? 'text-sm' : 'text-base'
                    } ${
                      dealsFilter === 'all'
                        ? 'text-[#2d2d2d] font-medium'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
                    aria-label="להציג את כל המבצעים"
                  >
                    הכל
                    {dealsFilter === 'all' && (
                      <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-purple-600 rounded-full"></span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs - only shown for chat or empty deals state */}
          {(activeTab === 'chat' || deals.length === 0) && (
            <div 
              className={`sticky top-0 -mx-4 px-4 z-10 transition-all duration-300 ease-out mb-4 ${
                isTabsCollapsed 
                  ? 'pt-1 pb-1' 
                  : 'pt-1 pb-1'
              }`}
            >
            <div className={`bg-white/95 backdrop-blur-sm rounded-full border border-gray-200 transition-all duration-300 ${
              isTabsCollapsed 
                ? 'p-0.5' 
                : 'p-1'
            }`}
            >
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange('chat')}
                className={`flex-1 rounded-full transition-all duration-200 focus:outline-none relative ${
                  isTabsCollapsed ? 'px-3 py-1.5' : 'px-4 py-2'
                } ${
                  activeTab === 'chat'
                    ? 'text-[#2d2d2d] bg-gray-100 font-medium'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                aria-label="לחזור לצ'אט"
              >
                צ׳אט
              </button>
              <button
                onClick={() => handleTabChange('deals')}
                className={`flex-1 rounded-full transition-all duration-200 relative focus:outline-none ${
                  isTabsCollapsed ? 'px-3 py-1.5' : 'px-4 py-2'
                } ${
                  activeTab === 'deals'
                    ? 'text-[#2d2d2d] bg-gray-100 font-medium'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                aria-label="לראות את המעקבים שלך"
              >
                המעקבים שלי
                {unreadDealsCount > 0 && activeTab === 'chat' && (
                  <span className="absolute -top-1 -left-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" aria-label={`${unreadDealsCount} מבצעים חדשים`}>
                    {unreadDealsCount}
                  </span>
                )}
              </button>
            </div>
            </div>
          </div>
          )}

          {/* Chat view */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                // Check if we need a date separator
                const showDateSeparator = index === 0 || 
                  (index > 0 && isDifferentDay(messages[index - 1].timestamp, msg.timestamp));
                const dateLabel = formatChatDate(msg.timestamp);

                return (
                  <div key={msg.id}>
                    {/* Date separator */}
                    {showDateSeparator && (
                      <div className="flex justify-center my-6" data-date-separator={dateLabel}>
                        <div 
                          className="px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
                          style={{ 
                            backgroundColor: 'var(--surface-date-separator)',
                            color: 'var(--text-meta-date)'
                          }}
                        >
                          {dateLabel}
                        </div>
                      </div>
                    )}

                    {/* Message bubble */}
                    <div 
                      className={`flex gap-2 ${msg.type === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}
                      data-message-date={dateLabel}
                    >
                    {msg.type === 'assistant' && (
                      <div className="flex-shrink-0">
                        <img
                          src={oshiyaAvatar}
                          alt="Oshiya"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] ${msg.type === 'user' ? 'mr-10' : 'ml-10'}`}>
                      {/* Image if exists */}
                      {msg.image && (
                        <div className="mb-2">
                          <img
                            src={msg.image}
                            alt="תמונה שהעלית"
                            className={`rounded-2xl max-w-full h-auto max-h-64 object-contain shadow-md ${
                              msg.type === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                            }`}
                          />
                        </div>
                      )}
                      
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          msg.type === 'user'
                            ? 'bg-purple-600 text-white rounded-tr-sm'
                            : 'bg-white text-gray-800 rounded-tl-sm border border-gray-200'
                        }`}
                      >
                        {msg.contentJSX ? (
                          <div className="leading-relaxed">{msg.contentJSX}</div>
                        ) : (
                          <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                        )}
                      </div>
                      
                      {/* Quick replies */}
                      {msg.type === 'assistant' && msg.quickReplies && index === messages.length - 1 && (
                        <div className="mt-3 space-y-2">
                          {msg.quickReplies.map((reply, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickReply(reply.value)}
                              className="flex items-center gap-2 w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                            >
                              {reply.icon}
                              <span>{reply.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="flex-shrink-0">
                    <img
                      src={oshiyaAvatar}
                      alt="Oshiya"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Deals view */}
          {activeTab === 'deals' && (
            <div className="space-y-4">
              {deals.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">🎯</div>
                    <h3 className="font-bold text-gray-900">עוד אין מבצע��ם</h3>
                    <p className="text-gray-600">
                      כשאושייה תזהה שזה באמת משתלם – הם יופיעו כאן.
                    </p>
                    <button
                      onClick={() => handleTabChange('chat')}
                      className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-all duration-200 hover:scale-105 shadow-md inline-flex items-center gap-2 mt-4"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>להגדיר מעקב חדש</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Helper text */}
                  <p className="text-xs text-gray-500 px-1 mt-4">
                    המחיר שמופיע עכשיו הוא מהעדכון האחרון באתר – ייתכן שהוא שונה מהמחיר שהיה בזמן ההתראה.
                  </p>

                  {/* Deals list */}
                  <div className="space-y-3">
                    {filteredDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white rounded-2xl p-4 border border-gray-200 space-y-3"
                      >
                        {/* Header with title and status badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{deal.productName}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                deal.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : deal.status === 'paused'
                                  ? 'bg-gray-100 text-gray-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {deal.status === 'active' ? 'פעיל עכשיו' : deal.status === 'paused' ? 'מושהה' : 'פג תוקף'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-600">{deal.storeName}</p>
                              {deal.status === 'active' && (
                                <span className="text-xs text-gray-400">• ממתינה להזדמנות</span>
                              )}
                              {deal.status === 'paused' && (
                                <span className="text-xs text-gray-400">• המעקב עצור</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Overflow menu button - only for active trackings */}
                          {deal.status === 'active' && (
                            <div className="relative">
                              <button
                                onClick={() => setActiveOverflowMenu(activeOverflowMenu === deal.id ? null : deal.id)}
                                className="p-1.5 md:p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="אפשרויות נוספות"
                              >
                                <EllipsisVertical className="w-5 h-5" />
                              </button>
                            
                            {/* Desktop popover menu */}
                            {isDesktop && activeOverflowMenu === deal.id && (
                              <div
                                ref={overflowMenuRef}
                                className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[180px] z-50"
                              >
                                {(deal.status === 'active' || deal.status === 'expired') && (
                                  <button
                                    onClick={() => {
                                      setShowEditPriceTarget(deal.id);
                                      setNewPriceTarget(deal.priceTarget?.toString() || '');
                                      setActiveOverflowMenu(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-right"
                                  >
                                    <Pencil className="w-4 h-4" />
                                    <span>שינוי יעד מחיר</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setShowPauseConfirmation(deal.id);
                                    setActiveOverflowMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-right"
                                >
                                  <Pause className="w-4 h-4" />
                                  <span>עצירת מעקב</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setShowRemoveConfirmation(deal.id);
                                    setActiveOverflowMenu(null);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-right"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>הסרת מעקב</span>
                                </button>
                              </div>
                            )}
                            </div>
                          )}
                        </div>

                        {/* Pricing information */}
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-1">
                              מחיר נוכחי:
                              <div className="relative group">
                                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-gray-900 text-white text-xs rounded-lg p-2 z-10">
                                  המחיר מוצג לפי העדכון האחרון, ויכול להשתנות מאז.
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </span>
                            <span className="font-bold text-gray-900">₪{deal.currentPrice}</span>
                          </div>
                          
                          {/* Price target */}
                          {deal.priceTarget && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 text-xs">יעד מחיר:</span>
                              <div className="flex items-center gap-2">
                                {recentlyUpdatedDeal === deal.id && (
                                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                    עודכן
                                  </span>
                                )}
                                <span className="text-gray-700 text-xs">₪{deal.priceTarget}</span>
                              </div>
                            </div>
                          )}
                          
                          {/* Price drop since tracking started */}
                          {deal.startingPrice && deal.currentPrice < deal.startingPrice && (
                            <div className="pt-0.5">
                              <span className="text-emerald-600 text-xs">
                                ירד ב־{Math.round(((deal.startingPrice - deal.currentPrice) / deal.startingPrice) * 100)}% מאז תחילת המעקב
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
                            <span>עודכן {formatTimestamp(deal.lastCheckedAt)}</span>
                          </div>
                        </div>

                        {/* Paused message - only for paused deals */}
                        {deal.status === 'paused' && (
                          <div className="text-sm px-3 py-2.5 bg-gray-50 rounded-lg text-gray-600">
                            המעקב עצור ולא נשלחות התראות
                          </div>
                        )}

                        {/* Expiration reason - only for expired deals */}
                        {deal.status === 'expired' && deal.expirationReason && (
                          <div className="text-sm px-3 py-2.5 bg-gray-50 rounded-lg text-gray-600">
                            {deal.expirationReason}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          {deal.status === 'active' ? (
                            <a
                              href={deal.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2"
                            >
                              <span>לרכישה</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <>
                              <button
                                onClick={() => setShowRestoreSheet(deal.id)}
                                className="flex-1 bg-[#2d2d2d] text-white px-4 py-3 rounded-xl hover:bg-[#3d3d3d] transition-all duration-200 hover:scale-[1.02] shadow-sm flex items-center justify-center gap-2"
                              >
                                <span>להחזיר למעקב</span>
                              </button>
                              <button
                                onClick={() => setShowRemoveConfirmation(deal.id)}
                                className="px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                              >
                                מחיקה
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom - only show in chat tab */}
      {activeTab === 'chat' && (
      <div className="flex-shrink-0 bg-white border-t border-purple-100 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto">
          {/* Image preview above input */}
          {uploadedImage && (
            <div className="mb-3 relative inline-block">
              <img
                src={uploadedImage}
                alt="תצוגה מקדימה"
                className="max-h-32 rounded-lg shadow-md border-2 border-purple-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -left-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            {/* Image upload icon */}
            <button
              type="button"
              onClick={handleImageButtonClick}
              className="flex-shrink-0 p-3 text-[#2d2d2d] hover:text-[#3d3d3d] hover:bg-gray-100 rounded-full transition-all touch-manipulation"
              aria-label="העלאת תמונה"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Text input */}
            <div className="flex-1">
              <textarea
                value={message}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="כתבי הודעה..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-purple-50/50 transition-all duration-200 resize-none overflow-hidden"
                style={{ minHeight: '48px', maxHeight: '200px' }}
                rows={1}
                ref={textareaRef}
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() && !uploadedImage}
              className="flex-shrink-0 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md flex items-center justify-center touch-manipulation"
              aria-label="שליחה"
            >
              <Send className="w-5 h-5" strokeWidth={2} />
            </button>
          </form>
        </div>
      </div>
      )}

      {/* Scroll to Latest Button */}
      <ChatScrollToLatestButton 
        onClick={scrollToLatestMessage}
        isVisible={showScrollToLatest && activeTab === 'chat' && currentPage === 'chat'}
      />

      {/* Fixed Accessibility Button - Always visible */}
      <AccessibilityButton onClick={() => setIsAccessibilityMenuOpen(true)} />
      
      {/* Accessibility Menu */}
      <AccessibilityMenu
        isOpen={isAccessibilityMenuOpen}
        onClose={() => setIsAccessibilityMenuOpen(false)}
        onNavigateToStatement={() => {
          setIsAccessibilityMenuOpen(false);
          setCurrentPage('accessibility');
        }}
        isDesktop={isDesktop}
      />

      {/* Mobile bottom sheet for overflow menu */}
      {!isDesktop && activeOverflowMenu !== null && (() => {
        const deal = deals.find(d => d.id === activeOverflowMenu);
        return (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setActiveOverflowMenu(null)}
            />
            
            {/* Bottom sheet */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 animate-slide-up" dir="rtl">
              <div className="p-6 space-y-2">
                {(deal?.status === 'active' || deal?.status === 'expired') && (
                  <button
                    onClick={() => {
                      setShowEditPriceTarget(activeOverflowMenu);
                      setNewPriceTarget(deal?.priceTarget?.toString() || '');
                      setActiveOverflowMenu(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                    <span>שינוי יעד מחיר</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowPauseConfirmation(activeOverflowMenu);
                    setActiveOverflowMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  <span>עצירת מעקב</span>
                </button>
                <button
                  onClick={() => {
                    setShowRemoveConfirmation(activeOverflowMenu);
                    setActiveOverflowMenu(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>הסרת מעקב</span>
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* Pause confirmation bottom sheet */}
      {showPauseConfirmation !== null && (() => {
        const deal = deals.find(d => d.id === showPauseConfirmation);
        return (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowPauseConfirmation(null)}
            />
            
            {/* Bottom sheet */}
            <div className={`fixed bg-white shadow-2xl z-50 ${
              isDesktop 
                ? 'inset-x-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6'
                : 'bottom-0 left-0 right-0 rounded-t-3xl p-6 animate-slide-up'
            }`} dir="rtl">
              {isDesktop && (
                <button
                  onClick={() => setShowPauseConfirmation(null)}
                  className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="סגור"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">עצירת מעקב</h3>
              <p className="text-sm text-gray-600 mb-6">
                המעקב ייעצר ולא נשלחות התראות.<br />
                אפשר להחזיר אותו בכל רגע.
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => handlePauseTracking(showPauseConfirmation)}
                  className="w-full bg-[#2d2d2d] text-white px-4 py-3 rounded-xl hover:bg-[#3d3d3d] transition-colors font-medium"
                >
                  עצור מעקב
                </button>
                <button
                  onClick={() => setShowPauseConfirmation(null)}
                  className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  ביטול
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* Remove confirmation dialog */}
      {showRemoveConfirmation !== null && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowRemoveConfirmation(null)}
          />
          
          {/* Dialog - bottom sheet on mobile, centered on desktop */}
          <div className={`fixed bg-white shadow-2xl z-50 ${
            isDesktop 
              ? 'inset-x-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6'
              : 'bottom-0 left-0 right-0 rounded-t-3xl p-6 animate-slide-up'
          }`} dir="rtl">
            {isDesktop && (
              <button
                onClick={() => setShowRemoveConfirmation(null)}
                className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="סגור"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <h3 className="text-lg font-bold text-gray-900 mb-2">האם להסיר את המעקב?</h3>
            <p className="text-sm text-gray-600 mb-6">
              המעקב יימחק לצמיתות מהרשימה
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => handleRemoveTracking(showRemoveConfirmation)}
                className="w-full bg-[#2d2d2d] text-white px-4 py-3 rounded-xl hover:bg-[#3d3d3d] transition-colors font-medium"
              >
                להסיר את המעקב
              </button>
              <button
                onClick={() => setShowRemoveConfirmation(null)}
                className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                ביטול
              </button>
            </div>
          </div>
        </>
      )}

      {/* Restore tracking bottom sheet */}
      {showRestoreSheet !== null && (() => {
        const deal = deals.find(d => d.id === showRestoreSheet);
        return (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowRestoreSheet(null)}
            />
            
            {/* Bottom sheet */}
            <div className={`fixed bg-white shadow-2xl z-50 ${
              isDesktop 
                ? 'inset-x-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6'
                : 'bottom-0 left-0 right-0 rounded-t-3xl p-6 animate-slide-up'
            }`} dir="rtl">
              {/* Header with X button (desktop only) */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">החזרת המעקב</h3>
                {isDesktop && (
                  <button
                    onClick={() => setShowRestoreSheet(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="סגור"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Restore with previous settings
                    const dealName = deals.find(d => d.id === showRestoreSheet)?.productName || 'המוצר';
                    setDeals(prevDeals => 
                      prevDeals.map(d => 
                        d.id === showRestoreSheet 
                          ? { ...d, status: 'active' as const, expirationReason: undefined, pausedAt: undefined }
                          : d
                      )
                    );
                    setShowRestoreSheet(null);
                    
                    // Show confirmation message
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      type: 'assistant',
                      content: `✅ ${dealName} חזר לרשימת הפעילים`,
                      timestamp: new Date(),
                    }]);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
                >
                  להחזיר למעקב
                </button>
                <button
                  onClick={() => {
                    const dealToEdit = deals.find(d => d.id === showRestoreSheet);
                    // Just open edit price target - don't restore yet
                    // The edit flow will handle restoring when user saves
                    setShowEditPriceTarget(showRestoreSheet);
                    setNewPriceTarget(dealToEdit?.priceTarget?.toString() || '');
                    setShowRestoreSheet(null);
                  }}
                  className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  להחזיר ולשנות יעד מחיר
                </button>
                <button
                  onClick={() => setShowRestoreSheet(null)}
                  className="w-full bg-white text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  ביטול
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* Edit Price Target bottom sheet */}
      {showEditPriceTarget !== null && (() => {
        const deal = deals.find(d => d.id === showEditPriceTarget);
        return (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => {
                setShowEditPriceTarget(null);
                setNewPriceTarget('');
              }}
            />
            
            {/* Bottom sheet */}
            <div className={`fixed bg-white shadow-2xl z-50 ${
              isDesktop 
                ? 'inset-x-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6'
                : 'bottom-0 left-0 right-0 rounded-t-3xl p-6 animate-slide-up'
            }`} dir="rtl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">שינוי יעד מחיר</h3>
              
              {/* Confirmation message for expired trackings */}
              {showExpiredConfirmation ? (
                <div className="py-8 text-center">
                  <div className="bg-gray-50 px-4 py-3 rounded-xl mb-4">
                    <p className="text-gray-900 font-medium">
                      היעד עודכן והמעקב חזר לפעילים
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Helper text for paused trackings */}
                  {deal?.status === 'paused' && (
                    <p className="text-sm text-gray-600 mb-4 bg-purple-50 px-3 py-2 rounded-lg">
                      שינוי יעד מחיר מחזיר את המעקב לפעיל
                    </p>
                  )}
                  
                  {/* Helper text for expired trackings */}
                  {deal?.status === 'expired' && (
                    <p className="text-sm text-gray-600 mb-4 bg-gray-50 px-3 py-2 rounded-lg">
                      שינוי יעד מחיר מחזיר את המעקב לפעיל
                    </p>
                  )}
                  
                  {/* Price input */}
                  <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">
                  יעד מחיר חדש (₪)
                </label>
                <input
                  type="number"
                  value={newPriceTarget}
                  onChange={(e) => setNewPriceTarget(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                  placeholder="הזן מחיר"
                  autoFocus
                />
              </div>
              
              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const targetPrice = parseFloat(newPriceTarget);
                    if (!isNaN(targetPrice) && targetPrice > 0) {
                      const dealToUpdate = deals.find(d => d.id === showEditPriceTarget);
                      const wasExpired = dealToUpdate?.status === 'expired';
                      
                      setDeals(prevDeals => 
                        prevDeals.map(d => 
                          d.id === showEditPriceTarget 
                            ? { ...d, priceTarget: targetPrice, status: 'active' as const, pausedAt: undefined, expirationReason: undefined }
                            : d
                        )
                      );
                      setRecentlyUpdatedDeal(showEditPriceTarget);
                      
                      if (wasExpired) {
                        setShowExpiredConfirmation(true);
                        setTimeout(() => {
                          setShowExpiredConfirmation(false);
                          setShowEditPriceTarget(null);
                          setNewPriceTarget('');
                        }, 2500);
                      } else {
                        setShowEditPriceTarget(null);
                        setNewPriceTarget('');
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors font-medium"
                >
                  שמור יעד חדש
                </button>
                <button
                  onClick={() => {
                    setShowEditPriceTarget(null);
                    setNewPriceTarget('');
                  }}
                  className="w-full bg-gray-100 text-gray-900 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  ביטול
                </button>
              </div>
              </>
              )}
            </div>
          </>
        );
      })()}
      </>
      )}

      {/* Other pages content area */}
      {currentPage !== 'chat' && (
        <div className="flex-1 overflow-y-auto">
          {currentPage === 'about' && <AboutPage onNavigateToWhat={() => setCurrentPage('what')} isDesktop={true} />}
          {currentPage === 'what' && <WhatPage isDesktop={true} />}
          {currentPage === 'how' && <HowPage onBack={() => setCurrentPage('chat')} isDesktop={true} />}
          {currentPage === 'privacy' && <PrivacyPage onClose={() => setCurrentPage('chat')} isDesktop={true} />}
          {currentPage === 'terms' && <TermsPage onClose={() => setCurrentPage('chat')} isDesktop={true} />}
          {currentPage === 'accessibility' && <AccessibilityPage onClose={() => setCurrentPage('chat')} isDesktop={true} />}
          {currentPage === 'accessibility-statement' && <AccessibilityStatementPage onClose={() => setCurrentPage('chat')} isDesktop={true} />}
          {currentPage === 'contact' && <ContactPage isDesktop={true} />}
          {currentPage === 'profile' && (
            <ProfilePage 
              onBack={() => setCurrentPage('chat')}
              firstName={conversationState.productData.firstName}
              phoneNumber={conversationState.productData.phone}
              onUpdateName={(newName) => {
                setConversationState(prev => ({
                  ...prev,
                  productData: { ...prev.productData, firstName: newName }
                }));
              }}
              onUpdatePhone={(newPhone) => {
                setConversationState(prev => ({
                  ...prev,
                  productData: { ...prev.productData, phone: newPhone }
                }));
              }}
              onUpgradeToPremium={() => setCurrentPage('premium-selection')}
              isPremium={isPremiumUser}
              subscriptionType={selectedPremiumPlan || undefined}
              renewalDate={
                premiumStartDate && selectedPremiumPlan
                  ? (() => {
                      const renewalDate = new Date(premiumStartDate);
                      if (selectedPremiumPlan === 'monthly') {
                        renewalDate.setMonth(renewalDate.getMonth() + 1);
                      } else {
                        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
                      }
                      return renewalDate.toLocaleDateString('he-IL');
                    })()
                  : undefined
              }
              activeTrackings={deals.filter(d => d.status === 'active').length}
              onCancelSubscription={() => {
                setIsPremiumUser(false);
                setSelectedPremiumPlan(null);
                setPremiumStartDate(null);
              }}
              isDesktop={true}
            />
          )}
          {currentPage === 'account' && (
            <AccountPage 
              onClose={() => setCurrentPage('chat')}
              firstName={conversationState.productData.firstName}
              phoneNumber={otpPhone}
              isDesktop={isDesktop}
              onLogout={() => {
                setIsLoggedIn(false);
                setCurrentPage('chat');
                const logoutMessage: Message = {
                  id: messages.length + 1,
                  type: 'assistant',
                  content: 'נותקנו 🙂\nכשתרצי לחזור – אני פה.',
                  timestamp: new Date(),
                };
                setMessages(prev => [...prev, logoutMessage]);
              }}
              onEditPhone={() => {
                setOtpReturnPage('account');
                setCurrentPage('otp');
              }}
              onUpdateName={(newName) => {
                setConversationState(prev => ({
                  ...prev,
                  productData: {
                    ...prev.productData,
                    firstName: newName
                  }
                }));
              }}
              trackings={deals.map(deal => ({
                id: deal.id,
                productName: deal.productName,
                status: deal.status
              }))}
              onNavigateToTrackings={() => {
                setCurrentPage('chat');
                setDealsFilter('active');
                handleTabChange('deals');
              }}
            />
          )}
          {currentPage === 'settings' && (
            <SettingsPage 
              onClose={() => setCurrentPage('chat')}
              isDesktop={true}
            />
          )}
          {currentPage === 'terms' && (
            <TermsPage 
              onClose={() => setCurrentPage('chat')}
              isDesktop={true}
            />
          )}
          {currentPage === 'trackings' && (
            <TrackingsPage 
              onBack={() => setCurrentPage('chat')}
              deals={deals}
              isDesktop={true}
            />
          )}
        </div>
      )}
    </div>
      )}
      
      {/* Development-only hidden button to reset onboarding */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
            localStorage.removeItem('oshiyafirstvisit');
            location.reload();
          }}
          style={{ display: 'none' }}
        >
          Reset Chat
        </button>
      )}
    </>
  );
}