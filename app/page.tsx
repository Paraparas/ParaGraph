'use client';

import React, { useState, useCallback } from 'react';
import { Message } from 'ai';
import { ChatWindow } from "@/components/ChatWindow";
import OpeningStage from '@/components/visualization/stages/OpeningStage';

export default function Home() {
  const [stage, setStage] = useState('pre-start');
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleMessagesChange = useCallback((newMessages: Message[]) => {
    if (newMessages.length > 0) {
      const lastMessage = newMessages[newMessages.length - 1];
      setCurrentMessage(lastMessage.content);
      
      if (lastMessage.role === 'user' && 
          (lastMessage.content.toLowerCase().includes('hackathon') || 
           lastMessage.content.toLowerCase().includes('building para'))) {
        
        console.log('Starting visualization');
        setStage('opening');
        
        const startTime = Date.now();
        const duration = 30000;
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min(elapsed / duration, 1);
          setProgress(newProgress);
          
          if (newProgress < 1) {
            requestAnimationFrame(updateProgress);
          }
        };
        
        requestAnimationFrame(updateProgress);
      }
    }
  }, []);

  const WelcomeCard = (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-3xl" />
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Para <span className="text-indigo-400">Research Navigator</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            Experience AI-driven problem solving through a self-referential journey of building Para itself.
          </p>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-8">
        <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            🚀
          </span>
          Quick Start
        </h2>
        <div className="space-y-4">
          <p className="text-slate-300">Begin your journey with:</p>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
            <code className="text-indigo-300">
              &quot;How do we approach building Para for this hackathon?&quot;
            </code>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900" />

      <div className="relative">
        {/* Gradient canvas - like Stripe's animated gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-3xl animate-pulse" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chat Panel */}
            <div className="rounded-2xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-xl shadow-2xl">
              <ChatWindow
                endpoint="api/chat"
                emoji="✨"
                titleText="Para: Self-Referential Demo"
                placeholder="Ask how to win this hackathon..."
                emptyStateComponent={WelcomeCard}
                onMessagesChange={handleMessagesChange}
              />
            </div>

            {/* Visualization Panel */}
            <div className="rounded-2xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-xl p-6 shadow-2xl">
              {stage === 'pre-start' ? (
                <div className="flex items-center justify-center h-[400px] text-center">
                  <div className="space-y-4">
                    <div className="text-xl text-slate-300">Visualization will appear here</div>
                    <div className="text-sm text-slate-400">
                      Ask about building Para to begin the journey
                    </div>
                  </div>
                </div>
              ) : (
                <OpeningStage progress={progress} currentMessage={currentMessage} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}