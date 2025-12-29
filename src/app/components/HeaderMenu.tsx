'use client';

import { useState, useEffect } from 'react';
import { Bell, User, Eye, Settings, ChevronDown } from 'lucide-react';
import { supabaseAuth } from '@/lib/supabase/client-auth';

interface HeaderMenuProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenDropdown: (dropdown: 'myArea' | 'oshiya' | null) => void;
  openDropdown: 'myArea' | 'oshiya' | null;
  onSetActiveTab: (tab: 'chat' | 'looks' | 'deals') => void;
}

export function HeaderMenu({
  currentPage,
  onNavigate,
  onOpenDropdown,
  openDropdown,
  onSetActiveTab,
}: HeaderMenuProps) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [localLoginState, setLocalLoginState] = useState(false);

  useEffect(() => {
    // Check localStorage for login state (for development mode without Supabase)
    if (typeof window !== 'undefined') {
      const savedLoginState = localStorage.getItem('oshiya-logged-in');
      setLocalLoginState(savedLoginState === 'true');
    }

    // If Supabase is not configured, use localStorage state only
    if (!supabaseAuth) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabaseAuth.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseAuth.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Also listen for localStorage changes (for development mode without Supabase)
  useEffect(() => {
    if (typeof window === 'undefined' || supabaseAuth) return;

    // Poll for localStorage changes (since we're reloading the page after login, this is mainly for consistency)
    const interval = setInterval(() => {
      const savedLoginState = localStorage.getItem('oshiya-logged-in');
      const isLoggedIn = savedLoginState === 'true';
      if (isLoggedIn !== localLoginState) {
        setLocalLoginState(isLoggedIn);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localLoginState]);

  const isLoggedIn = !!user || localLoginState;

  const handleProfileClick = () => {
    onNavigate('profile');
    onOpenDropdown(null);
  };

  const handleTrackingsClick = () => {
    onNavigate('chat');
    onSetActiveTab('deals');
    onOpenDropdown(null);
  };

  const handleSettingsClick = () => {
    onNavigate('settings');
    onOpenDropdown(null);
  };

  const handleLoginClick = () => {
    onNavigate('login');
    onOpenDropdown(null);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative dropdown-container">
      <button
        onClick={() => onOpenDropdown(openDropdown === 'myArea' ? null : 'myArea')}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          currentPage === 'account' ||
          currentPage === 'settings' ||
          currentPage === 'profile' ||
          currentPage === 'login'
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
          {isLoggedIn ? (
            <>
              <button
                onClick={handleProfileClick}
                className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>הפרופיל שלי</span>
              </button>
              <button
                onClick={handleTrackingsClick}
                className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>המעקבים שלי</span>
              </button>
              <button
                onClick={handleSettingsClick}
                className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span>ההגדרות שלי</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="w-full text-right px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-2"
            >
              <span>התחברות</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

