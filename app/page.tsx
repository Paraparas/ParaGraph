'use client';

import React, { useState, useCallback } from 'react';
import { Message } from 'ai';
import { ChatWindow } from "@/components/ChatWindow";
import OpeningStage from '@/components/visualization/stages/OpeningStage';

export default function Home() {
  const [stage, setStage] = useState('pre-start');
  const [progress, setProgress] = useState(0);

  // Add state for current message
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
  }, [stage]);

  const WelcomeCard = (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        Para Research Navigator
      </h1>
      <p className="text-lg text-blue-200 leading-relaxed">
        Watch how Para breaks down complex problems using its own development journey
      </p>
      
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/50 to-slate-900/50 border border-blue-500/20 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-blue-300">Start Your Journey</h2>
        <div className="prose prose-invert">
          <p className="text-blue-100 mb-4">Begin by asking:</p>
          <div className="p-4 rounded-lg bg-blue-950/50 border border-blue-500/30">
            <code className="text-emerald-400">
              &quot;How do we approach building Para for this hackathon?&quot;
            </code>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Panel - Now on the left */}
          <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-blue-900/30 to-slate-900/30 border border-blue-500/20">
            <ChatWindow
              endpoint="api/chat"
              emoji="🌟"
              titleText="Para: Self-Referential Demo"
              placeholder="Ask how to win this hackathon..."
              emptyStateComponent={WelcomeCard}
              onMessagesChange={handleMessagesChange}
            />
          </div>

          {/* Visualization Panel - Now on the right */}
          <div className="rounded-2xl backdrop-blur-md bg-gradient-to-br from-slate-900/50 to-blue-900/50 border border-blue-500/20 p-6">
            {stage === 'pre-start' ? (
              <div className="flex items-center justify-center h-[400px] text-center">
                <div className="space-y-4">
                  <div className="text-xl text-blue-200">Visualization will appear here</div>
                  <div className="text-sm text-blue-400">
                    Ask about building Para to begin the journey
                  </div>
                </div>
              </div>
            ) : (
              <OpeningStage progress={progress} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}