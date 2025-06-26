import { ChatInterface } from "@/components/chat/chat-interface";
import { getAiRecommendation } from "@/app/actions";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="px-4 py-3 border-b shrink-0">
        <h1 className="text-2xl font-bold font-headline text-primary">
          StreamWise
        </h1>
        <p className="text-sm text-muted-foreground font-headline">
          AI-powered movie & TV recommendations
        </p>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto flex flex-col p-0 sm:p-4">
          <ChatInterface getAiRecommendation={getAiRecommendation} />
        </div>
      </main>
    </div>
  );
}
