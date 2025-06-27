# StreamWise Project Report

### Project Vision & Core Technology
For this project, I set out to build StreamWise, an intelligent, conversational web application for discovering movie and TV show recommendations. The initial goal was to accept a user's "vibe" (e.g., "dark comedy with a twist") and return a personalized list. However, the project evolved into a more dynamic discovery tool. The core of the application is powered by Google's Gemini model, integrated using the **Genkit** framework, allowing for a rich, interactive dialogue with the user.

### Core Features
*   **Conversational Interface:** A clean, intuitive chat UI (`ChatInterface.tsx`) where users can input their preferences.
*   **AI-Powered Recommendations:** Utilizes Google's Gemini model via a structured **Genkit flow** (`generate-recommendation.ts`) to understand user input and generate relevant, well-formatted recommendations.
*   **Interactive Recommendation Cards:** Each recommendation is more than static text. It's an interactive component:
    *   **Clear Type Indicator:** A badge with an icon clearly indicates whether the title is a "Movie" or a "TV Show".
    *   **Expandable Details:** The card can be expanded to reveal more details like the director and main actors.
    *   **Smart Streaming Links:** The component recognizes streaming service names (e.g., "Netflix", "Hulu") in the AI's response and automatically wraps them in a link to that service's homepage.
*   **Deeper Exploration & Discovery:**
    *   **"More info":** This button calls a separate, dedicated AI flow (`get-more-info.ts`) to fetch and display a detailed synopsis and interesting trivia about the selected title, all without navigating away from the chat.
    *   **"More like this":** This triggers a new search for recommendations similar to the selected title, allowing users to pivot their discovery process easily.
    *   **"New Results":** At the bottom of each set of results, this button prompts the AI for a fresh list of recommendations based on the original "vibe," but intelligently excludes all titles that have already been suggested in the current session.
*   **Interactive Query Building:** The theme badges on each recommendation are clickable. When a user clicks a theme (e.g., "sci-fi heist"), it's appended to the search input bar, allowing them to build up a more complex query by combining themes from different suggestions.
*   **Managed Sidebar Experience:** A collapsible sidebar holds AI-generated suggestions and the user's search history.
    *   **Stateful History:** The app remembers the 5 most recent searches using `localStorage`.
    *   **History Management:** I added "Clear History" and "Refresh Suggestions" buttons for easy management of the sidebar content.
*   **Component-Based UI:** Built with React and styled with ShadCN UI components and Tailwind CSS for a modern and responsive design.


### Key Code Snippets & Explanations

#### src/app/page.tsx (Main Page & State Management)
This is the main entry point of the app. It manages the application's state, including search history and the list of generated suggestions. It uses the `useState`, `useEffect`, and `useCallback` hooks to handle state changes, persist the search history to the browser's `localStorage`, and manage interactions between the sidebar and the main chat interface.

```tsx
// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";

// ... other imports
const MAX_HISTORY_LENGTH = 5;
const HISTORY_STORAGE_KEY = "streamwise_history";


export default function Home() {
  const [history, setHistory] = useState<string[]>([]);
  // ... other state

  useEffect(() => {
    // Load history from localStorage on initial render
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  const handleNewSearch = (searchTerm: string, themes: string[] = []) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    
    setHistory((prevHistory) => {
      const newHistory = [trimmed, ...prevHistory.filter(item => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_HISTORY_LENGTH);
      // ... save to localStorage
      return newHistory;
    });
  };
  
  // ... JSX for Sidebar and ChatInterface
}
```

#### src/app/actions.ts (Backend Logic)
This file uses Next.js Server Actions to securely handle the backend logic. It defines two key functions: `getAiRecommendation` and `getMoreMovieInfo`. These functions act as a bridge between the frontend components and the backend Genkit AI flows. When a user requests recommendations or more information, the frontend calls these actions, which in turn invoke the appropriate AI flow and return the result.

```ts
// src/app/actions.ts
'use server';

import { generateRecommendation, GenerateRecommendationInput } from '@/ai/flows/generate-recommendation';
import { getMoreInfo, GetMoreInfoInput } from '@/ai/flows/get-more-info';

export async function getAiRecommendation(vibe: string, exclude: string[] = []): Promise<RecommendationResult> {
  // ... error handling
  try {
    const input: GenerateRecommendationInput = { vibe };
    if (exclude.length > 0) {
      input.exclude = exclude;
    }
    const recommendation = await generateRecommendation(input);
    return recommendation;
  } catch (error) {
    // ... error handling
  }
}
```

#### src/ai/flows/generate-recommendation.ts (Genkit AI Flow)
This Genkit flow defines the primary AI prompt and its expected input/output structure using Zod schemas. It instructs the LLM to act as a recommendation expert, generating a list of 6 movies or shows based on the user's vibe. Crucially, it can also accept a list of titles to `exclude`, which enables the "New Results" feature. By enforcing a strict output schema, I ensure the AI's response is always in a consistent, usable format for the frontend.

```ts
// src/ai/flows/generate-recommendation.ts
const generateRecommendationPrompt = ai.definePrompt({
  name: 'generateRecommendationPrompt',
  input: {schema: GenerateRecommendationInputSchema},
  output: {schema: GenerateRecommendationOutputSchema},
  prompt: `You are a movie and TV show recommendation expert. Your goal is to provide exactly 6 recommendations based on the user's desired vibe.

  Analyze the user's desired vibe: {{{vibe}}}
  
  {{#if exclude}}
  IMPORTANT: Do not include any of the following titles in your response, as they have already been suggested:
  {{#each exclude}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Generate exactly 6 new, unique recommendations based on your general training data.
  `, 
});
```

### AI Infrastructure Explained
The AI functionality in StreamWise is built on a modern stack designed for reliability and structure:
1.  **Genkit (The AI Orchestrator):** This project uses Genkit as its core AI framework. It's responsible for managing the AI-powered features.
    *   **Flows:** In files like `src/ai/flows/generate-recommendation.ts`, I defined Genkit "flows." A flow is a server-side function that orchestrates calls to language models and other tools. It's conceptually similar to a "chain" in other frameworks.
    *   **Structured Output:** A key advantage of Genkit is its ability to enforce a specific output structure. By defining a Zod schema for the expected output, I can compel the AI to return perfectly formatted JSON every time. This eliminates a major source of errors and makes integrating the AI's response into the UI much more reliable.
2.  **Google Gemini (The Brain):** Genkit is configured to use Google's Gemini model. This is the advanced LLM that does the heavy lifting of understanding a user's "vibe" and generating creative, relevant recommendations based on its training data.
3.  **Next.js Server Actions (The Bridge):** Server Actions are the glue between the client-side React components and the server-side AI logic. When a user sends a message, the app calls a Server Action (e.g., `getAiRecommendation`). This function runs securely on the server, invokes the Genkit flow, awaits the response from Gemini, and then returns the structured data to the user's browser to be displayed.

### Approach
The development approach was centered on creating a seamless and intelligent user experience by breaking down the problem into three main parts:
*   **Frontend:** Build a clean, component-based UI using React and ShadCN that is both beautiful and functional.
*   **Backend:** Use Next.js Server Actions to create a lightweight and secure backend, avoiding the need for a separate API server.
*   **AI Integration:** Leverage **Genkit** to define and orchestrate structured AI workflows, ensuring reliable and well-formatted responses from the language model.

I started by building the core chat functionality and then layered on the more advanced features like history and interactive recommendations, ensuring each piece was working before moving to the next.

### Challenges
*   **State Management:** Passing a "search" command from the sidebar (in `page.tsx`) to the `ChatInterface` component was a challenge. I solved this by lifting state up to the `Home` component and passing a `searchTrigger` prop. When a history item is clicked, it updates this prop, which a `useEffect` hook in `ChatInterface` listens to, triggering a new search.
*   **Handling Asynchronous AI:** AI responses can be slow and may fail. To create a good user experience, I implemented a visual loading state (a spinner) in the chat window while waiting for the AI. I also used the Toast component to display clear, user-friendly error messages if the AI request failed, rather than letting the app crash or hang.
*   **Prompt Engineering:** Getting the AI to consistently return a high-quality recommendation in the correct format required careful prompt design. By defining a clear Zod schema for the output (`GenerateRecommendationOutputSchema`) and giving the AI an explicit role ("You are a movie and TV show recommendation expert"), I was able to guide the model to produce the desired results reliably.
*   **AI Reliability & Iterative Refinement:** A key example of iterative development was handling external links. My first attempt was to have the AI generate IMDb links. This proved unreliable, as the AI would often "hallucinate" incorrect URLs. I pivoted to a more robust solution: instead of asking for a full, fragile URL, I modified the UI to recognize the streaming service name (e.g., "Netflix") in the AI's text response and automatically wrap it in a link to that service's homepage. This trial-and-error process was a critical part of the project, leading to a more stable and useful feature.
*   **Technical Problem-Solving (Hydration Error):** During development, I encountered and resolved a common Next.js hydration error caused by nesting a clickable `<button>` element within another button element in a React component. I fixed this by refactoring the inner element to a `div`, while preserving its interactive, button-like functionality and accessibility through ARIA roles and keyboard event handlers. This ensured a smooth, error-free user experience.

### Resources Utilized
*   **Next.js Documentation:** Essential for understanding the App Router, Server Actions, and client vs. server components.
*   **Genkit Documentation:** Key for learning how to define AI flows, create structured prompts with schemas, and interact with the Gemini models.
*   **ShadCN UI & Tailwind CSS Docs:** Used extensively for building the user interface, including the sidebar, chat components, cards, and overall styling.
*   **React Documentation:** Referenced for core concepts like `useState`, `useEffect`, and `useCallback` to manage component state and lifecycle.

### Future Work
The current recommendation system relies on the LLM's general knowledge, which is powerful but can be improved. The main opportunity for future work is to implement Retrieval-Augmented Generation (RAG). This would involve creating a searchable vector database of movie/TV show information (using a tool like LlamaIndex with PGVector, as planned in the placeholder `index-movies-tv.ts` flow). By having the AI first search this specific, curated knowledge base, the recommendations would become even more accurate and could be based on a custom, up-to-date catalog. This would be the next logical step in evolving StreamWise into a truly expert recommendation engine.
