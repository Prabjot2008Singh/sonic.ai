// FIX: Define the Song interface, which was used but not declared, and removed a broken import.
export interface Song {
  id: string;
  title: string;
  artist: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  songs?: Song[];
  type?: 'text' | 'language-selection' | 'quick_moods' | 'discover_more';
  user?: {
    firstName: string;
  };
  mood?: string; // To carry the mood context for "Discover More"
}

export interface AIResponse {
  intent: 'mood_query' | 'change_language' | 'greeting' | 'question';
  mood: string;
  responseText: string;
  songs: { title: string; artist: string; }[];
}

export interface HistoryEntry {
  song: Song;
  mood: string;
  timestamp: number;
}

export type Page = 'chat' | 'terms' | 'privacy' | 'about' | 'contact';
export type Theme = 'light' | 'dark' | 'system';