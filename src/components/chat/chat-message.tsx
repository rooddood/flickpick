"use client";

import { GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Bot, ChevronRight, Tv2, User } from "lucide-react";
import React from "react";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: React.ReactNode | GenerateRecommendationOutput;
};

type SingleRecommendation = GenerateRecommendationOutput[0];

const RecommendationItem = ({ recommendation }: { recommendation: SingleRecommendation }) => (
  <Collapsible
    className="border-b"
    style={{ borderLeft: `4px solid hsl(${recommendation.themeColor})` }}
  >
    <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-muted/50 [&[data-state=open]>svg]:rotate-90">
      <div className="flex-1 pr-4">
        <h3 className="font-headline text-lg font-semibold">{recommendation.title}</h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {recommendation.themes?.map((theme, i) => (
            <Badge key={i} variant="secondary" className="capitalize">
              {theme}
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Tv2 className="h-4 w-4 shrink-0" />
          <span>Available on <strong>{recommendation.streamingAvailability}</strong></span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 transition-transform" />
    </CollapsibleTrigger>
    <CollapsibleContent className="px-3 pb-3">
      <div className="border-t pt-3">
        <p className="text-foreground/80 mb-3 text-sm">{recommendation.description}</p>
        <p className="text-sm font-medium">
          Starring: <span className="font-normal text-muted-foreground">{recommendation.mainActors.join(', ')}</span>
        </p>
      </div>
    </CollapsibleContent>
  </Collapsible>
);


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
