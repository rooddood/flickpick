
# StreamWise Project Report - Supplementary Notes

### Project Vision & Core Technology
For this project, I set out to build StreamWise, an intelligent, conversational application for discovering movie and TV show recommendations. The core of the application is powered by Google's Gemini model, which I integrated using the Genkit framework. I designed an initial AI flow that could take a user's described "vibe" (e.g., "dark comedy with a twist") and return a list of personalized recommendations, which formed the foundation of the app.

### Iterative Development and Feature Refinement
The development process was highly iterative, focused on enhancing the user experience based on successive refinements.

A key example of this was handling external links. My first attempt was to have the AI generate IMDb links. This proved unreliable, as the AI would often "hallucinate" incorrect URLs. I pivoted to a more robust solution for streaming availability: instead of trying to link to the specific movie page (which was also fragile), I implemented a system that recognizes the service name (e.g., "Netflix", "Hulu") in the AI's text response and automatically wraps it in a link to that service's homepage. This trial-and-error process was a critical part of the project, leading to a more stable and useful feature.

### Key Features Implemented
To move beyond a simple chat bot, I implemented several key features to create a more dynamic and interactive experience:

*   **Interactive Recommendation Cards:** Each recommendation is displayed on a card. I added a clear badge with an icon to indicate whether the title is a "Movie" or a "TV Show". The card is also expandable, revealing more details like the director and main actors.

*   **Deeper Exploration:** Within each card's expanded view, I added two crucial buttons:
    *   **"More info":** This button calls a separate, dedicated AI flow to fetch and display a detailed synopsis and interesting trivia about the selected title, all without navigating away from the chat.
    *   **"More like this":** This triggers a new search for recommendations similar to the selected title, allowing users to pivot their discovery process easily.

*   **Continuous Discovery:** At the bottom of each set of results, I added a "New Results" button. This prompts the AI for a fresh list of recommendations based on the original "vibe," but intelligently excludes all titles that have already been suggested in the current session.

*   **Interactive Query Building:** I made the theme badges on each recommendation clickable. When a user clicks a theme (e.g., "sci-fi heist"), it's appended to the search input bar, allowing them to build up a more complex query by combining themes from different suggestions.

*   **Sidebar for Usability:** I implemented a collapsible sidebar that holds AI-generated suggestions and the user's search history. To keep this UI clean, I limited the history to the 5 most recent entries and added "Refresh" and "Clear History" buttons for easy management.

### Technical Problem-Solving
During development, I encountered and resolved a common Next.js hydration error. The error was caused by nesting a clickable element within another button element in a React component. I fixed this by refactoring the inner element to a `div`, while preserving its interactive, button-like functionality and accessibility through ARIA roles and keyboard event handlers. This ensured a smooth, error-free user experience.

### Final Outcome
The final result is a polished, intelligent, and highly interactive application that provides a fun and intuitive way for users to discover their next favorite movie or TV show. The iterative development process was key to arriving at a feature set that is both powerful and reliable.
