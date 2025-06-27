"use client";

import { getAiRecommendation } from "@/app/actions";
import { ChatInterface } from "@/components/chat/chat-interface";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { History, Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

const MAX_HISTORY_LENGTH = 10;
const STORAGE_KEY = "streamwise_history";

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchTrigger, setSearchTrigger] = useState<{ term: string, id: number } | null>(null);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const defaultSuggestions = [
        "classic film noir",
        "mind-bending sci-fi",
        "family comedy",
        "space documentary",
        "tense courtroom drama",
    ];

    if (history.length > 0) {
      const uniqueWords = new Set<string>();
      const stopWords = new Set(['a', 'an', 'the', 'movie', 'about', 'with', 'that', 'show', 'for', 'is', 'in', 'and', 'tv', 'esque', 'does', 'like']);
      history.forEach(item => {
        item.split(' ').forEach(word => {
          const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
          if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
            uniqueWords.add(cleanWord);
          }
        });
      });
      
      const shuffled = Array.from(uniqueWords).sort(() => 0.5 - Math.random());
      const newSuggestions = shuffled.slice(0, 5);

      if (newSuggestions.length > 0) {
        setSuggestions(newSuggestions);
      } else {
        // As a fallback, show shuffled default suggestions so the list doesn't disappear
        setSuggestions(defaultSuggestions.sort(() => 0.5 - Math.random()).slice(0, 5));
      }
    } else {
        setSuggestions(defaultSuggestions);
    }
  }, [history]);

  const handleNewSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setHistory((prevHistory) => {
      const newHistory = [trimmed, ...prevHistory.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_HISTORY_LENGTH);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return newHistory;
    });
  };

  const handleHistoryClick = (term: string) => {
    setSearchTrigger({ term, id: Date.now() });
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="pt-8">
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Lightbulb /> Suggestions
            </SidebarGroupLabel>
            <SidebarMenu>
              {suggestions.map((item, index) => (
                <SidebarMenuItem key={`sugg-${index}`}>
                  <SidebarMenuButton onClick={() => handleHistoryClick(item)} className="w-full justify-start text-left h-auto p-2 capitalize">
                    {item}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {history.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <History /> History
              </SidebarGroupLabel>
              <SidebarMenu>
                {history.map((item, index) => (
                  <SidebarMenuItem key={`hist-${index}`}>
                    <SidebarMenuButton onClick={() => handleHistoryClick(item)} className="w-full justify-start text-left h-auto p-2">
                      {item}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <div className="flex flex-col h-screen bg-background text-foreground">
          <header className="px-4 py-3 border-b shrink-0 flex items-center gap-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary">
                StreamWise
              </h1>
              <p className="text-sm text-muted-foreground font-headline">
                AI-powered movie & TV recommendations
              </p>
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            <div className="h-full max-w-6xl mx-auto flex flex-col p-0 sm:p-4">
              <ChatInterface 
                getAiRecommendation={getAiRecommendation} 
                onNewSearch={handleNewSearch}
                searchTrigger={searchTrigger}
              />
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
