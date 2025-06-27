"use client";

import { GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, Tv2, User } from "lucide-react";
import Image from "next/image";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: React.ReactNode | GenerateRecommendationOutput;
};

type SingleRecommendation = GenerateRecommendationOutput[0];

const RecommendationCard = ({ recommendation }: { recommendation: SingleRecommendation }) => (
  <Card className="bg-card border shadow-sm text-card-foreground overflow-hidden flex flex-col">
    <div className="relative w-full aspect-[2/3]">
      <Image
        data-ai-hint="movie poster"
        src={`https://placehold.co/200x300.png`}
        alt={`Poster for ${recommendation.title}`}
        fill
        className="rounded-t-md object-cover"
      />
    </div>
    <div className="p-3 flex flex-col flex-grow">
      <h3 className="font-headline text-accent text-base font-semibold leading-tight">
        {recommendation.title}
      </h3>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {recommendation.themes?.map((theme, i) => (
          <Badge key={i} variant="secondary" className="font-normal capitalize text-xs px-1.5 py-0.5">
            {theme}
          </Badge>
        ))}
      </div>
      <p className="text-foreground/80 text-sm mt-3 flex-grow">{recommendation.description}</p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-headline mt-3 pt-3 border-t">
        <Tv2 className="h-4 w-4 text-accent" />
        <span>Available on: <strong>{recommendation.streamingAvailability}</strong></span>
      </div>
    </div>
  </Card>
);

export function ChatMessage({ message }: { message: Message }) {
  const isBot = message.role === "bot";
  const isRecommendationList = isBot && Array.isArray(message.content);

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
          "max-w-full w-full rounded-lg", // Changed max-w-xl to max-w-full
          isBot ? (isRecommendationList ? 'bg-transparent' : 'bg-muted px-4 py-3') : "bg-primary text-primary-foreground px-4 py-3"
        )}
      >
        {isRecommendationList ? (
          <div className="flex flex-col gap-3">
             <p className="text-muted-foreground mb-1">Here are a few ideas for you:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(message.content as GenerateRecommendationOutput).map((rec, index) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
            </div>
          </div>
        ) : (
          <div className="text-inherit whitespace-pre-wrap">{message.content}</div>
        )}
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
