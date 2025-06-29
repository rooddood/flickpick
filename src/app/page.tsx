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
import { History, Lightbulb, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const MAX_HISTORY_LENGTH = 5;
const HISTORY_STORAGE_KEY = "flickpick_history";
const THEMES_STORAGE_KEY = "flickpick_themes";
const MAX_SUGGESTIONS = 20;

const defaultSuggestions = [
  "classic film noir",
  "mind-bending sci-fi",
  "family comedy",
  "space documentary",
  "tense courtroom drama",
];

export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  const [allSuggestions, setAllSuggestions] = useState<string[]>(defaultSuggestions);
  const [searchTrigger, setSearchTrigger] = useState<{ term: string, id: number } | null>(null);
  const [displayedSuggestions, setDisplayedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      
      const storedThemes = localStorage.getItem(THEMES_STORAGE_KEY);
      if (storedThemes) {
        const parsedThemes = JSON.parse(storedThemes);
        if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
          setAllSuggestions(parsedThemes);
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const refreshSuggestions = useCallback(() => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    setDisplayedSuggestions(shuffled.slice(0, 5));
  }, [allSuggestions]);


  useEffect(() => {
    // This runs only on the client, after the initial render, to prevent hydration mismatch.
    refreshSuggestions();
  }, [refreshSuggestions]);

  const handleNewSearch = (searchTerm: string, themes: string[] = []) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    
    setHistory((prevHistory) => {
      const newHistory = [trimmed, ...prevHistory.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_HISTORY_LENGTH);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return newHistory;
    });

    if (themes.length > 0) {
      setAllSuggestions((prevSuggestions) => {
        const combined = [...themes, ...prevSuggestions];
        const uniqueThemes = [...new Set(combined.map(s => s.toLowerCase()))];
        const newSuggestions = uniqueThemes.slice(0, MAX_SUGGESTIONS);
        try {
          localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(newSuggestions));
        } catch (error) {
          console.error("Failed to save suggestions to localStorage", error);
        }
        return newSuggestions;
      });
    }
  };

  const handleHistoryClick = (term: string) => {
    setSearchTrigger({ term, id: Date.now() });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="pt-8">
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" /> 
              <span>Suggestions</span>
              <button onClick={refreshSuggestions} title="Refresh suggestions" className="ml-auto p-1 rounded-md hover:bg-sidebar-accent">
                <RefreshCw className="h-4 w-4" />
                <span className="sr-only">Refresh suggestions</span>
              </button>
            </SidebarGroupLabel>
            <SidebarMenu>
              {displayedSuggestions.map((item, index) => (
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
                <History className="h-4 w-4" /> 
                <span>History</span>
                <button onClick={handleClearHistory} title="Clear history" className="ml-auto p-1 rounded-md hover:bg-sidebar-accent">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear history</span>
                </button>
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
                FlickPick
              </h1>
              <p className="text-sm text-muted-foreground font-headline">
                Your next favorite movie is just a vibe away.
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
