import React from 'react';
import Image from 'next/image';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface Message {
  id: number | string;
  type: 'user' | 'assistant';
  content: string;
  contentJSX?: React.ReactNode;
  image?: string;
  quickReplies?: QuickReply[];
  inlineInputs?: InlineInput[];
  timestamp: Date;
  showAfterDelay?: number;
  source?: 'script' | 'ai' | 'user';
  canSaveToLooks?: boolean;
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

export interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
  message: string;
  setMessage: (msg: string) => void;
  handleSend: () => void;
  handleImageUpload: (file: File) => void;
  uploadedImage: string | null;
  setUploadedImage: (img: string | null) => void;
  handleQuickReply: (value: string) => void;
}

export function ChatInterface({ 
  messages, 
  isTyping, 
  message, 
  setMessage, 
  handleSend, 
  handleImageUpload,
  uploadedImage,
  setUploadedImage,
  handleQuickReply
}: ChatInterfaceProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            data-testid={`message-${msg.id}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.type === 'user' 
                ? 'bg-white border-2 border-purple-200 text-gray-900' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            }`}>
              {msg.contentJSX || msg.content}
              {msg.image && (
                <Image src={msg.image} alt="Uploaded" width={400} height={300} className="mt-2 rounded-lg max-w-full" unoptimized />
              )}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.quickReplies.map((reply: QuickReply, index: number) => (
                    <button
                      key={index}
                      data-testid="quick-reply-button"
                      onClick={() => handleQuickReply(reply.value)}
                      className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium border border-white/20"
                      style={{ minHeight: '44px' }}
                      data-quick-reply-value={reply.value}
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>
              )}
              {msg.inlineInputs && msg.inlineInputs.length > 0 && (
                <div className="mt-3">
                  {/* Inline inputs rendering would go here */}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start" data-testid="typing-indicator">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[70%]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm">אושייה כותבת...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {uploadedImage && (
            <div className="mb-3 relative inline-block" data-testid="uploaded-image-container">
              <Image src={uploadedImage} alt="To upload" width={128} height={128} className="max-h-32 rounded-lg" unoptimized />
              <button
                onClick={() => setUploadedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                data-testid="delete-uploaded-image"
                aria-label="Delete image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ImageIcon className="w-5 h-5 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                data-testid="file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="כתבי כאן..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              data-testid="message-input"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() && !uploadedImage}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="send-button"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
