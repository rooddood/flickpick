# FlickPick

FlickPick is an intelligent, conversational web application designed to provide personalized movie and TV show recommendations. Stop endless scrolling and find your next favorite flick by simply describing the vibe you're looking for.

FlickPick leverages the power of AI to understand your mood and deliver curated suggestions complete with details and streaming information, making movie night decisions easier and more fun than ever.

## Running Locally

To run FlickPick on your local machine, you'll need to have Node.js and npm installed. Follow these steps:

### 1. Set Up Your Environment

First, you'll need to provide your Google AI API key. The application uses the Gemini model, which requires this key for authentication.

1.  Create a new file named `.env` in the root of the project.
2.  Add the following line to the `.env` file, replacing `your_api_key_here` with your actual key:

    ```
    GOOGLE_API_KEY=your_api_key_here
    ```

### 2. Install Dependencies

Open your terminal in the project's root directory and run the following command to install the necessary packages:

```bash
npm install
```

### 3. Start the AI Services

Genkit runs as a separate server to handle the AI flows. Start it by running:

```bash
npm run genkit:dev
```

Keep this terminal window open. You should see a message indicating that the Genkit server is running.

### 4. Start the Frontend Application

In a new terminal window, run the following command to start the Next.js development server:

```bash
npm run dev
```

This will start the web application, typically on `http://localhost:9002`. You can now open this URL in your browser to start using FlickPick!
