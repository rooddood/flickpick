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

type SingleRecommendation = GenerateRecommendationOutput[0];

const RecommendationCard = ({ recommendation }: { recommendation: SingleRecommendation }) => (
  <Card className="bg-card border shadow-sm text-card-foreground">
    <CardHeader className="p-4">
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
    <CardContent className="p-4 pt-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-headline">
        <Tv2 className="h-5 w-5 text-accent" />
        <span>Available on: <strong>{recommendation.streamingAvailability}</strong></span>
      </div>
    </CardContent>
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
          "max-w-xl rounded-lg",
          isBot ? (isRecommendationList ? 'bg-transparent' : 'bg-muted px-4 py-3') : "bg-primary text-primary-foreground px-4 py-3"
        )}
      >
        {isRecommendationList ? (
          <div className="flex flex-col gap-4">
             <p className="text-muted-foreground mb-2">Here are a few ideas for you:</p>
            {(message.content as GenerateRecommendationOutput).map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
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
