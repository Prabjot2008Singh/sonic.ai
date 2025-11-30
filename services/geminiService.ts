import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from '../types';

// This schema and prompt logic is moved from the (now deleted) backend function.
const aiResponseSchema = {
    type: Type.OBJECT,
    properties: {
      intent: {
          type: Type.STRING,
          description: "Categorize the user's intent. Must be one of: 'mood_query', 'change_language', 'greeting', 'question'. Default to 'mood_query' if unsure."
      },
      mood: {
        type: Type.STRING,
        description: "A single, lowercase word that best describes the user's primary emotion (e.g., happy, reflective, nostalgic, adventurous). If no clear mood is detected, or intent is not 'mood_query', this should be 'neutral'.",
      },
      responseText: {
        type: Type.STRING,
        description: "A very short, friendly response (one sentence, max 15 words) in the same language as the user's input. It should introduce songs, answer a question, or clarify the bot's purpose."
      },
      songs: {
        type: Type.ARRAY,
        description: "A list of up to 6 songs. Should be an empty array if the intent is not 'mood_query' or if no mood was detected.",
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
    required: ["intent", "mood", "responseText", "songs"],
};


export async function getAiResponse(
  userInput: string, 
  languages: string[],
  apiKey: string, // API key is now required and used directly
): Promise<AIResponse> {
  if (!apiKey) {
    throw new Error('API key is not valid. Please check it in the settings.');
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const languageInstruction = languages.length > 0
      ? `Based on the mood, find up to 6 relevant songs from the following languages/music industries: ${languages.join(', ')}. Prioritize these selections.`
      : 'Based on the mood, find up to 6 relevant songs. If possible, infer a suitable genre or language from the user\'s input language and context.';
    
    const isDiscoverMore = userInput.startsWith('DISCOVER_MORE_');
    const moodForDiscovery = isDiscoverMore ? userInput.split('_')[2] : '';
    const discoveryPrompt = isDiscoverMore 
      ? `The user wants to discover more music for the mood: '${moodForDiscovery}'. Find another set of up to 6 songs matching this mood. The responseText should be something like "Here are some more songs for you."`
      : `1. Read the user's input: "${userInput}".`;

    const modelResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are Sonic AI, an empathetic and sophisticated music sommelier.
      Your task is to analyze the user's input to determine their intent and mood, then suggest songs or respond appropriately.
      You must generate a response in a specific JSON format.

      Context about Sonic AI for answering questions:
      - Creator: Sonic AI was created by Mr. Prabjot Singh. In Hindi, his name is श्री प्रभजोत सिंह.
      - Purpose: Its mission is to connect users with music that matches their emotional state.

      Instructions:
      ${discoveryPrompt}
      2. **Determine the user's intent**. If the user is asking to discover more, the intent is 'mood_query'. Otherwise, it must be one of:
         - 'change_language': If the user wants to change their music language/industry preferences (e.g., "change language", "quiero música en español").
         - 'mood_query': If the user is describing a mood, feeling, or asking for music. This is the most common intent.
         - 'greeting': For simple greetings like 'hello', 'hi', 'how are you?'.
         - 'question': For questions about you (who you are, your purpose, who made you, etc.).
      3. **Detect the user's language**. All text you generate for 'responseText' MUST be in this language.
      4. **Handle based on intent**:
         - If intent is 'change_language': Set 'mood' to 'neutral', 'songs' to an empty array \`[]\`, and 'responseText' to a confirmation message like "Of course! Please select your new preferences below." in the user's language.
         - If intent is 'greeting' or 'question': Respond conversationally in 'responseText' using the context provided above. Set 'mood' to 'neutral' and 'songs' to \`[]\`. If the user asks about your creator, mention Mr. Prabjot Singh. If responding in Hindi, you MUST use the spelling 'प्रभजोत सिंह'.
         - If intent is 'mood_query':
           a. Analyze for a clear mood. If discovering more, use the provided mood '${moodForDiscovery}'. If none, set 'mood' to 'neutral', 'songs' to \`[]\`, and 'responseText' to a message asking the user to describe their feeling.
           b. If a mood is detected, identify a single lowercase word for it.
           c. ${languageInstruction}
           d. Craft a VERY concise 'responseText' (under 15 words) in the user's language. Example: "Feeling happy? Here are some tunes."
      
      User Input: "${userInput}"`,
      config: {
        systemInstruction: "You are Sonic AI. First, determine the user's intent ('mood_query', 'change_language', 'greeting', 'question'). Then, detect the user's language. Your 'responseText' must be a single, VERY short, friendly sentence (under 15 words) in the user's language. For 'mood_query', also determine the mood as a single lowercase word (or 'neutral'). Always adhere to the JSON format.",
        responseMimeType: "application/json",
        responseSchema: aiResponseSchema,
      },
    });
    
    const jsonText = modelResponse.text?.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI.");
    }
    const parsed = JSON.parse(jsonText);
    return parsed;

  } catch (error: any) {
    console.error("Error fetching AI response:", error);
    if (error.message && (error.message.includes('API key not valid') || error.message.includes('API key is invalid'))) {
        throw new Error('The provided API key is not valid. Please check it in the settings.');
    }
    throw new Error('Failed to get a response from the AI. Please check your API Key and network connection.');
  }
}