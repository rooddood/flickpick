
"use client";

import { GenerateRecommendationOutput, GetMoreInfoInput } from "@/ai/flows/generate-recommendation";
import { MoreInfoResult } from "@/app/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Bot, ChevronRight, Film, Loader2, RefreshCw, Tv2, User } from "lucide-react";
import React, { useState } from "react";

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

type RecommendationItemProps = {
  recommendation: SingleRecommendation;
  onMoreLikeThis: (searchTerm: string) => void;
  getMoreInfoAction: (input: GetMoreInfoInput) => Promise<MoreInfoResult>;
  onThemeClick: (theme: string) => void;
};

const RecommendationItem = ({ recommendation, onMoreLikeThis, getMoreInfoAction, onThemeClick }: RecommendationItemProps) => {
  const [moreInfo, setMoreInfo] = useState<MoreInfoResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMoreInfoClick = async () => {
    if (moreInfo) {
      return;
    }
    setIsLoading(true);
    const result = await getMoreInfoAction({
      title: recommendation.title,
      director: recommendation.director,
    });
    setIsLoading(false);

    if (result && "error" in result) {
      toast({
        variant: "destructive",
        title: "Could not fetch details",
        description: result.error,
      });
    } else {
      setMoreInfo(result);
    }
  };

  const handleMoreLikeThisClick = () => {
    onMoreLikeThis(`More movies and TV shows like ${recommendation.title}`);
  };
  
  const StreamingInfo = () => {
    const serviceName = recommendation.streamingAvailability
      .replace('Stream on ', '')
      .replace('Rent/Buy on ', '');
    
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
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    onThemeClick(theme);
                  }}
                  className="appearance-none p-0 border-0 bg-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                >
                  <Badge variant="secondary" className="capitalize cursor-pointer hover:bg-primary/20 transition-colors">
                    {theme}
                  </Badge>
                </button>
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
          <div className="flex items-center gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={handleMoreLikeThisClick}>More like this</Button>
            <Button size="sm" variant="outline" onClick={handleMoreInfoClick} disabled={isLoading || !!moreInfo}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              More info
            </Button>
          </div>
          {moreInfo && !('error' in moreInfo) && (
            <div className="mt-2 pt-2 border-t space-y-2 text-sm">
                <h4 className="font-semibold mt-2">Synopsis</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{moreInfo.detailedSynopsis}</p>
                <h4 className="font-semibold mt-2">Trivia</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {moreInfo.trivia.map((fact, i) => <li key={i}>{fact}</li>)}
                </ul>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

type ChatMessageProps = {
  message: Message;
  isGenerating?: boolean;
  onMoreLikeThis: (searchTerm: string) => void;
  getMoreInfoAction: (input: GetMoreInfoInput) => Promise<MoreInfoResult>;
  onThemeClick: (theme: string) => void;
  onNewResults?: () => void;
};

export function ChatMessage({ message, isGenerating, onMoreLikeThis, getMoreInfoAction, onNewResults, onThemeClick }: ChatMessageProps) {
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
                <RecommendationItem 
                  key={index} 
                  recommendation={rec}
                  onMoreLikeThis={onMoreLikeThis}
                  getMoreInfoAction={getMoreInfoAction}
                  onThemeClick={onThemeClick}
                />
              ))}
            </div>
            {onNewResults && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={onNewResults} disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  New Results
                </Button>
              </div>
            )}
          </div>
        );
      }
      return (
        <div className="rounded-lg bg-muted px-4 py-3">
          <p>I couldn't find any recommendations that fit that vibe. Could you try being a bit more descriptive or try a different search?</p>
        </div>
      );
    }
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
