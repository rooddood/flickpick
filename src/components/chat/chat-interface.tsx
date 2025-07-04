
"use client";

import { getMoreMovieInfo, type RecommendationResult } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import { ChatMessage, type Message } from "./chat-message";
import type { GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation";

type ChatInterfaceProps = {
  getAiRecommendation: (vibe: string, exclude?: string[]) => Promise<RecommendationResult>;
  onNewSearch?: (vibe: string, themes?: string[]) => void;
  searchTrigger?: { term: string, id: number } | null;
};

export function ChatInterface({ getAiRecommendation, onNewSearch, searchTrigger }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "bot",
      content: "What kind of movie or TV show are you in the mood for tonight? You can also pick from suggestions on the left.",
    },
  ]);
  const [input, setInput] = useState("");
  const [currentVibe, setCurrentVibe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim() || isLoading) return;

    setCurrentVibe(searchTerm);

    const userInput: Message = { id: crypto.randomUUID(), role: "user", content: searchTerm };
    const loadingMessage: Message = { id: crypto.randomUUID(), role: 'bot', content: <div className="flex justify-center items-center p-2"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> };

    setMessages((prev) => [...prev, userInput, loadingMessage]);
    setInput("");
    setIsLoading(true);

    const result = await getAiRecommendation(searchTerm, []);
    
    setIsLoading(false);

    if ("error" in result && result.error) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: result.error,
      });
      setMessages(prev => prev.slice(0, -1));
      onNewSearch?.(searchTerm, []);
    } else if (!("error" in result)) {
      const themes = result.flatMap(rec => rec.themes || []);
      onNewSearch?.(searchTerm, themes);
      const botResponse: Message = { id: crypto.randomUUID(), role: "bot", content: result };
      setMessages((prev) => [...prev.slice(0, -1), botResponse]);
    } else {
        toast({
            variant: "destructive",
            title: "Request Failed",
            description: "An unexpected error occurred.",
        });
        setMessages(prev => prev.slice(0, -1));
        onNewSearch?.(searchTerm, []);
    }
  }, [getAiRecommendation, isLoading, onNewSearch, toast]);

  const handleGenerateNewResults = useCallback(async () => {
    if (!currentVibe || isLoading) return;

    setIsLoading(true);
    
    const excludedTitles = messages.reduce((acc: string[], message) => {
      if (message.role === 'bot' && Array.isArray(message.content)) {
        const recommendations = message.content as GenerateRecommendationOutput;
        recommendations.forEach(rec => acc.push(rec.title));
      }
      return acc;
    }, []);

    const loadingMessage: Message = { id: crypto.randomUUID(), role: 'bot', content: <div className="flex justify-center items-center p-2"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> };
    setMessages(prev => [...prev, loadingMessage]);

    const result = await getAiRecommendation(currentVibe, excludedTitles);
    
    setIsLoading(false);

    if ("error" in result && result.error) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: result.error,
      });
      setMessages(prev => prev.slice(0, -1));
    } else if (!("error" in result)) {
      const themes = result.flatMap(rec => rec.themes || []);
      onNewSearch?.(currentVibe, themes);
      const botResponse: Message = { id: crypto.randomUUID(), role: "bot", content: result };
      setMessages((prev) => [...prev.slice(0, -1), botResponse]);
    } else {
        toast({
            variant: "destructive",
            title: "Request Failed",
            description: "An unexpected error occurred.",
        });
        setMessages(prev => prev.slice(0, -1));
    }
  }, [currentVibe, isLoading, messages, getAiRecommendation, onNewSearch, toast]);


  useEffect(() => {
    if (searchTrigger) {
      setMessages(prev => prev.slice(0, 1));
      performSearch(searchTrigger.term);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger]);

  const handleThemeClick = useCallback((theme: string) => {
    setInput((prevInput) => {
      const trimmedInput = prevInput.trim();
      const existingThemes = trimmedInput.split(' ').filter(Boolean);
      if (existingThemes.some(t => t.toLowerCase() === theme.toLowerCase())) {
        return trimmedInput;
      }
      return trimmedInput ? `${trimmedInput} ${theme}` : theme;
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    performSearch(input);
  };

  return (
    <div className="flex flex-col h-full w-full bg-card border rounded-lg shadow-lg">
      <div ref={chatContainerRef} className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id}
            message={message}
            isGenerating={isLoading}
            onMoreLikeThis={performSearch}
            getMoreInfoAction={getMoreMovieInfo}
            onNewResults={handleGenerateNewResults}
            onThemeClick={handleThemeClick}
          />
        ))}
      </div>
      <div className="border-t p-4 bg-background/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a vibe, e.g., 'a thrilling mystery with a twist'..."
            className="flex-1"
            disabled={isLoading}
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
