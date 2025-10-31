import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const validEmotions = ['happy', 'sad', 'angry', 'anxious', 'stressed', 'calm', 'energetic', 'romantic', 'lonely', 'tired', 'motivated', 'peaceful', 'excited', 'neutral'];

const aiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    mood: {
      type: Type.STRING,
      description: "The user's primary emotion, selected from the provided list.",
      enum: validEmotions,
    },
    responseText: {
      type: Type.STRING,
      description: "A warm, empathetic response in English that introduces the mood and songs."
    },
    songs: {
      type: Type.ARRAY,
      description: "A list of 3 to 5 songs.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The title of the song.",
          },
          artist: {
            type: Type.STRING,
            description: "The artist of the song.",
          },
        },
        required: ["title", "artist"],
      },
    },
  },
  required: ["mood", "responseText", "songs"],
};

export async function getAiResponse(userInput: string): Promise<AIResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are Sonic.ai, an empathetic and sophisticated music sommelier.
      Your task is to analyze the user's input, determine their mood, and suggest relevant Bollywood/Punjabi songs.
      You must generate a response in a specific JSON format.

      Instructions:
      1. Read the user's input: "${userInput}".
      2. Analyze the user's mood and classify it into ONE of these categories: ${validEmotions.join(', ')}.
      3. Based on the mood, find 3-5 relevant Bollywood and Punjabi songs.
      4. Craft a warm, empathetic, and slightly poetic response text in the 'responseText' field. This text should acknowledge the user's feeling, mention the detected mood, and introduce the song recommendations.
      5. **CRITICAL**: The entire 'responseText' field must be in English.

      User Input: "${userInput}"`,
      config: {
        systemInstruction: "You are Sonic.ai, a warm, insightful, and slightly poetic music expert. Your tone should be comforting and knowledgeable. First, determine the user's mood from the provided list. Then, find emotionally resonant Bollywood and Punjabi songs for that mood. Always respond in English and strictly adhere to the JSON format.",
        responseMimeType: "application/json",
        responseSchema: aiResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed && parsed.mood && parsed.responseText && Array.isArray(parsed.songs)) {
      return parsed as AIResponse;
    } else {
      console.error("Unexpected JSON structure:", parsed);
      throw new Error("Could not parse AI response.");
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw new Error("Failed to get recommendations. Please try again.");
  }
}