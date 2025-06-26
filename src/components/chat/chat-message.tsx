"use client";

import { GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot, Clapperboard, Tv2, User } from "lucide-react";
import Image from "next/image";

export type Message = {
  id: string;
  role: "user" | "bot";
  content: React.ReactNode | GenerateRecommendationOutput;
};

const RecommendationCard = ({ recommendation }: { recommendation: GenerateRecommendationOutput }) => (
  <Card className="bg-transparent border-0 shadow-none text-card-foreground">
    <CardHeader className="p-0">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-shrink-0">
          <Image
            data-ai-hint="movie poster"
            src={`https://placehold.co/100x150.png`}
            alt={`Poster for ${recommendation.title}`}
            width={100}
            height={150}
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex-1">
          <CardTitle className="font-headline text-accent flex items-center gap-2">
            <Clapperboard className="h-6 w-6" /> {recommendation.title}
          </CardTitle>
          <CardDescription className="mt-2 text-foreground/80">
            {recommendation.description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0 mt-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-headline">
        <Tv2 className="h-5 w-5 text-accent" />
        <span>Available on: <strong>{recommendation.streamingAvailability}</strong></span>
      </div>
    </CardContent>
  </Card>
);

export function ChatMessage({ message }: { message: Message }) {
  const isBot = message.role === "bot";
  const isRecommendation = isBot && typeof message.content === 'object' && message.content && 'title' in (message.content as any);

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
          "max-w-md rounded-lg px-4 py-3",
          isBot ? (isRecommendation ? 'p-0 bg-transparent' : 'bg-muted') : "bg-primary text-primary-foreground"
        )}
      >
        {isRecommendation ? (
          <RecommendationCard recommendation={message.content as GenerateRecommendationOutput} />
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
