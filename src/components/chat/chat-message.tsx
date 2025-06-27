
"use client";

import { GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Bot, ChevronRight, Film, Tv2, User } from "lucide-react";
import React from "react";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: React.ReactNode | GenerateRecommendationOutput;
};

type SingleRecommendation = GenerateRecommendationOutput[0];

const STREAMING_SITES: { [key: string]: string } = {
  'Netflix': 'https://www.netflix.com',
  'Amazon Prime': 'https://www.primevideo.com',
  'Hulu': 'https://www.hulu.com',
  'Disney+': 'https://www.disneyplus.com',
  'HBO Max': 'https://www.max.com',
  'Max': 'https://www.max.com',
  'Apple TV+': 'https://tv.apple.com',
  'Paramount+': 'https://www.paramountplus.com',
  'Showtime': 'https://www.paramountplus.com/shows/showtime/',
  'Peacock': 'https://www.peacocktv.com',
};


const RecommendationItem = ({ recommendation }: { recommendation: SingleRecommendation }) => {
  const StreamingInfo = () => {
    // Extract service name from a string like "Stream on Netflix" or "Rent/Buy on Amazon Prime"
    const serviceName = recommendation.streamingAvailability
      .replace('Stream on ', '')
      .replace('Rent/Buy on ', '');
    
    // Find a matching site from our map
    const siteKey = Object.keys(STREAMING_SITES).find(key => serviceName.includes(key));
    const siteUrl = siteKey ? STREAMING_SITES[siteKey] : null;

    const content = (
      <>{recommendation.streamingAvailability}</>
    );

    if (siteUrl) {
      return (
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:underline shrink-0"
        >
          {content}
        </a>
      );
    }

    return <p className="text-sm text-muted-foreground shrink-0">{content}</p>;
  };
  
  return (
    <Collapsible
      className="border-b"
      style={{ borderLeft: `4px solid hsl(${recommendation.themeColor})` }}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-2 text-left transition-colors hover:bg-muted/50 [&[data-state=open]>svg]:rotate-90">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3">
            <h3 className="font-headline text-lg font-semibold">{recommendation.title}</h3>
            {recommendation.type && (
              <Badge variant="outline" className="shrink-0 flex items-center gap-1 font-normal">
                {recommendation.type === 'Movie' ? <Film className="h-3.5 w-3.5" /> : <Tv2 className="h-3.5 w-3.5" />}
                {recommendation.type}
              </Badge>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
            <div className="flex flex-wrap gap-1.5">
              {recommendation.themes?.map((theme, i) => (
                <Badge key={i} variant="secondary" className="capitalize">
                  {theme}
                </Badge>
              ))}
            </div>
            <StreamingInfo />
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 transition-transform" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 pb-2">
        <div className="border-t pt-2 space-y-2">
          <p className="text-foreground/80 text-sm">{recommendation.description}</p>
          <div className="space-y-1">
            {recommendation.director && (
                <p className="text-sm font-medium">
                    Director: <span className="font-normal text-muted-foreground">{recommendation.director}</span>
                </p>
            )}
            {recommendation.mainActors && recommendation.mainActors.length > 0 && (
              <p className="text-sm font-medium">
                Starring: <span className="font-normal text-muted-foreground">{recommendation.mainActors.join(', ')}</span>
              </p>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};


export function ChatMessage({ message }: { message: Message }) {
  const isBot = message.role === "bot";
  const isRecommendationList = isBot && Array.isArray(message.content);

  const renderContent = () => {
    if (isRecommendationList) {
      const recommendations = message.content as GenerateRecommendationOutput;
      if (recommendations.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground mb-1 px-1">Here are a few ideas for you:</p>
            <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
              {recommendations.map((rec, index) => (
                <RecommendationItem key={index} recommendation={rec} />
              ))}
            </div>
          </div>
        );
      }
      // Fallback for when the AI returns an empty list
      return (
        <div className="rounded-lg bg-muted px-4 py-3">
          <p>I couldn't find any recommendations that fit that vibe. Could you try being a bit more descriptive or try a different search?</p>
        </div>
      );
    }
    // For regular text messages and loading indicators
    return <div className="text-inherit whitespace-pre-wrap">{message.content}</div>;
  };

  return (
    <div className={cn("flex items-start gap-3", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "w-full max-w-2xl rounded-lg",
          isBot ? (isRecommendationList ? 'bg-transparent' : 'bg-muted px-4 py-3') : "bg-primary text-primary-foreground px-4 py-3"
        )}
      >
        {renderContent()}
      </div>
      {!isBot && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
