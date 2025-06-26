# **App Name**: StreamWise

## Core Features:

- Preference Input: Accept user input regarding their movie and TV preferences via a chat interface. The user enters the vibe of the thing they want to watch.
- Contextual Retrieval: Embed user preferences and search a vector database of movie/TV show information for relevant content using similarity search to find the best matches.
- Recommendation Generation: Use Langchain to create a chain of LLM prompts. Employ the context from the vector database as a tool, along with user preferences, to generate a personalized movie/TV show recommendation.
- Recommendation Output: Display the movie/TV show recommendation, including title, description, streaming availability, and potentially a trailer, to the user in the chat interface.
- Knowledge Indexing: Index movie/TV show data (title, description, genre, actors, streaming services) using LlamaIndex and store vector embeddings using PGVector with PostgreSQL to create a searchable knowledge base.
- Uncluttered UI: A clean, intuitive layout that focuses on the chat interaction and the presentation of movie/TV show recommendations.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to evoke a sense of entertainment and sophistication.
- Background color: Dark gray (#303030) to create a cinematic viewing experience.
- Accent color: Teal (#00BCD4) to highlight key elements such as recommended titles and streaming service logos.
- Chat font: 'Roboto' (sans-serif) for clear readability of chat messages and recommendations.
- Interface font: 'Open Sans' (sans-serif) for interface text, providing a clean and modern aesthetic.
- Use recognizable streaming service logos and simple icons from a set like Font Awesome to represent genres and other content-related information.
- Single-screen layout with a clear separation between the chat window (for input and output) and the recommendation display area, potentially with a collapsible context window for detailed information.
- Subtle transitions and loading animations to provide a smooth user experience during content retrieval and recommendation generation, such as a loading spinner while the LLM is processing the request.