git push origin main
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Setting up AI Features

This project uses Google's Gemini models for its AI-powered features. To enable them, you need to provide a Gemini API key.

1.  **Get an API Key**: Visit [Google AI Studio](https://aistudio.google.com) and click "Get API key".
2.  **Create `.env` file**: Make sure you have a `.env` file in the root of your project.
3.  **Add the Key**: Add the following line to your `.env` file, replacing `YOUR_API_KEY_HERE` with the key you copied:

```
GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

The AI features will now be enabled in your application.

