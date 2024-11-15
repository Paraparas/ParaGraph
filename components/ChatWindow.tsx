'use client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Message } from 'ai';
import { useChat } from "ai/react";
import { useRef, useState, ReactElement, useEffect } from "react";
import type { FormEvent } from "react";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { UploadDocumentsForm } from "@/components/UploadDocumentsForm";
import { IntermediateStep } from "./IntermediateStep";

export function ChatWindow(props: {
  endpoint: string,
  emptyStateComponent: ReactElement,
  placeholder?: string,
  titleText?: string,
  emoji?: string;
  showIngestForm?: boolean,
  showIntermediateStepsToggle?: boolean,
  onMessagesChange?: (messages: Message[]) => void
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  const { 
    endpoint, 
    emptyStateComponent, 
    placeholder, 
    titleText = "An LLM", 
    showIngestForm, 
    showIntermediateStepsToggle, 
    emoji,
    onMessagesChange
  } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] = useState(false);
  const ingestForm = showIngestForm && <UploadDocumentsForm></UploadDocumentsForm>;
  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input type="checkbox" id="show_intermediate_steps" name="show_intermediate_steps" checked={showIntermediateSteps} onChange={(e) => setShowIntermediateSteps(e.target.checked)}></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const [sourcesForMessages, setSourcesForMessages] = useState<Record<string, any>>({});

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading, setMessages } =
    useChat({
      api: endpoint,
      onFinish() {
        console.log('Chat finished, messages updated:', messages);
        onMessagesChange?.(messages);
      },
      streamMode: "text",
      onError: (e) => {
        toast(e.message, {
          theme: "dark"
        });
      }
    });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    
    // Notify immediately of user message
    const userMessage: Message = {
      id: String(messages.length),
      role: 'user',
      content: input
    };
    onMessagesChange?.([...messages, userMessage]);

    if (!messages.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return;
    }
    if (!showIntermediateSteps) {
      handleSubmit(e);
    } else {
      setIntermediateStepsLoading(true);
      setInput("");
      const messagesWithUserReply = messages.concat({ id: messages.length.toString(), content: input, role: "user" });
      setMessages(messagesWithUserReply);
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true
        })
      });
      const json = await response.json();
      setIntermediateStepsLoading(false);
      if (response.status === 200) {
        const responseMessages: Message[] = json.messages;
        const toolCallMessages = responseMessages.filter((responseMessage: Message) => {
          return (responseMessage.role === "assistant" && !!responseMessage.tool_calls?.length) || responseMessage.role === "tool";
        });
        const intermediateStepMessages = [];
        for (let i = 0; i < toolCallMessages.length; i += 2) {
          const aiMessage = toolCallMessages[i];
          const toolMessage = toolCallMessages[i + 1];
          intermediateStepMessages.push({
            id: (messagesWithUserReply.length + (i / 2)).toString(),
            role: "system" as const,
            content: JSON.stringify({
              action: aiMessage.tool_calls?.[0],
              observation: toolMessage.content,
            })
          });
        }
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        }
        setMessages([
          ...newMessages,
          {
            id: (newMessages.length).toString(),
            content: responseMessages[responseMessages.length - 1].content,
            role: "assistant"
          },
        ]);
      } else {
        if (json.error) {
          toast(json.error, {
            theme: "dark"
          });
          throw new Error(json.error);
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Gradient Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl" />
        <div className="relative px-6 py-4">
          <h2 className={`${messages.length > 0 ? "" : "hidden"} text-xl font-semibold text-white flex items-center gap-2`}>
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center backdrop-blur-sm">
              {emoji}
            </span>
            {titleText}
          </h2>
        </div>
      </div>

      {/* Messages Container with Elegant Scrollbar */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
        {messages.length === 0 ? emptyStateComponent : (
          <div
            ref={messageContainerRef}
            className="flex flex-col-reverse py-4 space-y-reverse space-y-4"
          >
            {[...messages].reverse().map((m, i) => {
              const sourceKey = (messages.length - 1 - i).toString();
              return m.role === "system" ? (
                <IntermediateStep key={m.id} message={m} />
              ) : (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  aiEmoji={emoji}
                  sources={sourcesForMessages[sourceKey]}
                />
              );
            })}
          </div>
        )}
      </div>

      {messages.length === 0 && ingestForm}

      {/* Gradient Input Section */}
      <div className="relative px-6 py-4 bg-gradient-to-r from-slate-900/50 to-indigo-900/50 backdrop-blur-xl border-t border-slate-700/50">
        {intemediateStepsToggle && (
          <div className="mb-4 text-slate-300">
            {intemediateStepsToggle}
          </div>
        )}
        
        <form onSubmit={sendMessage} className="relative">
          <input
            className="w-full p-4 pr-28 rounded-xl bg-slate-800/50 border border-slate-700/50 
              text-white placeholder-slate-400 backdrop-blur-sm shadow-lg
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
              transition-all duration-200"
            value={input}
            placeholder={placeholder ?? "Type your message..."}
            onChange={handleInputChange}
            disabled={chatEndpointIsLoading || intermediateStepsLoading}
          />
          <button
            type="submit"
            disabled={chatEndpointIsLoading || intermediateStepsLoading || !input.trim()}
            className="absolute right-2 top-2 px-4 py-2 rounded-lg
              bg-gradient-to-r from-indigo-500 to-purple-500
              text-white font-medium shadow-lg
              hover:from-indigo-600 hover:to-purple-600
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {(chatEndpointIsLoading || intermediateStepsLoading) ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Thinking</span>
              </div>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>

      <ToastContainer 
        position="bottom-right"
        theme="dark"
        toastClassName="!bg-slate-800 !text-slate-200 !border !border-slate-700/50 !rounded-xl"
      />
    </div>
  );
}