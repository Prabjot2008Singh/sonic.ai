export interface Song {
  title: string;
  artist: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  songs?: Song[];
}

export interface AIResponse {
  mood: string;
  responseText: string;
  songs: Song[];
}

export type Page = 'login' | 'chat' | 'terms' | 'privacy' | 'about' | 'contact';