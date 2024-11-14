'use client';

import React, { useState, useCallback } from 'react';
import { Message } from 'ai';
import { ChatWindow } from "@/components/ChatWindow";
import OpeningStage from '@/components/visualization/stages/OpeningStage';

export default function Home() {
  const [stage, setStage] = useState('pre-start');
  const [progress, setProgress] = useState(0);

  // Handle message updates with simpler logic
  const handleMessagesChange = useCallback((newMessages: Message[]) => {
    // Only process if we have messages and we're not already showing visualization
    if (newMessages.length > 0 && stage === 'pre-start') {
      const lastMessage = newMessages[newMessages.length - 1];
      
      if (lastMessage.role === 'user' && 
          (lastMessage.content.toLowerCase().includes('hackathon') || 
           lastMessage.content.toLowerCase().includes('building para'))) {
        
        console.log('Starting visualization');
        setStage('opening');
        
        // Start a single animation timer
        const startTime = Date.now();
        const duration = 30000; // 30 seconds
        
        function updateProgress() {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min(elapsed / duration, 1);
          setProgress(newProgress);
          
          if (newProgress < 1 && stage === 'opening') {
            requestAnimationFrame(updateProgress);
          }
        }
        
        requestAnimationFrame(updateProgress);
      }
    }
  }, [stage]);

  const WelcomeCard = (
    <div className="p-4 md:p-8 rounded bg-gradient-to-br from-blue-900 to-slate-900 w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4 font-bold text-white">
        Building Para: A Self-Referential Journey
      </h1>
      <p className="text-lg text-blue-100 mb-6">
        Watch Para demonstrate its problem-solving capabilities by guiding you through its own development story
      </p>
      
      <div className="space-y-6">
        <section className="border border-blue-800 rounded-lg p-4 bg-slate-900/50">
          <h2 className="text-xl font-semibold mb-3 text-blue-200">Story Highlights</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">💡</span>
              <span>From vague idea to structured solution</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🔄</span>
              <span>Meta-narrative approach to problem-solving</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">🎯</span>
              <span>Step-by-step development journey</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">✨</span>
              <span>Interactive feature demonstrations</span>
            </li>
          </ul>
        </section>

        <div className="text-center text-blue-200 bg-blue-900/30 p-4 rounded-lg">
          <p>Start with: &quot;How do we approach building Para for this hackathon?&quot;</p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col items-center p-4 gap-4">
      {/* Visualization Section */}
      <div className="w-full max-w-4xl min-h-[400px] flex items-center justify-center bg-slate-900 rounded-lg p-4">
        {stage === 'pre-start' ? (
          <div className="text-center text-gray-400">
            <div className="text-xl mb-2">Visualization will appear here</div>
            <div className="text-sm">Try asking: &quot;How do we approach building Para for this hackathon?&quot;</div>
          </div>
        ) : (
          <div className="w-full h-full">
            <OpeningStage progress={progress} />
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="w-full max-w-4xl">
        <ChatWindow
          endpoint="api/chat"
          emoji="🌟"
          titleText="Para: Self-Referential Demo"
          placeholder="Ask how to win this hackathon..."
          emptyStateComponent={WelcomeCard}
          onMessagesChange={handleMessagesChange}
        />
      </div>
    </main>
  );
}