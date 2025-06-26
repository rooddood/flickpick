"use client";

import { GenerateRecommendationOutput } from "@/ai/flows/generate-recommendation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="item-1" className="border-b-0">
      <Card className="bg-card border shadow-sm text-card-foreground overflow-hidden">
        <AccordionTrigger className="p-4 text-left w-full hover:no-underline [&>svg]:ml-4">
          <div className="flex items-start gap-4 w-full">
            <div className="flex-shrink-0">
              <Image
                data-ai-hint="movie poster"
                src={`https://placehold.co/80x120.png`}
                alt={`Poster for ${recommendation.title}`}
                width={80}
                height={120}
                className="rounded-md object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-headline text-accent text-lg font-semibold flex items-center gap-2">
                <Clapperboard className="h-5 w-5" /> {recommendation.title}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {recommendation.themes?.map((theme, i) => (
                  <Badge key={i} variant="secondary" className="font-normal capitalize">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="border-t pt-4">
            <p className="text-foreground/80 text-sm mb-4">{recommendation.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-headline">
              <Tv2 className="h-5 w-5 text-accent" />
              <span>Available on: <strong>{recommendation.streamingAvailability}</strong></span>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  </Accordion>
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
          "max-w-xl w-full rounded-lg",
          isBot ? (isRecommendationList ? 'bg-transparent' : 'bg-muted px-4 py-3') : "bg-primary text-primary-foreground px-4 py-3"
        )}
      >
        {isRecommendationList ? (
          <div className="flex flex-col gap-3">
             <p className="text-muted-foreground mb-1">Here are a few ideas for you:</p>
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
