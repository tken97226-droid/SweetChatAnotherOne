export interface Message {
  id: string;
  sender: 'user' | 'character';
  text: string;
  timestamp: string;
}

export interface Character {
  id: string;
  name: string;
  avatar: string;
  role: string;
  level: string;
  personality: string[];
  description: string;
  systemPrompt: string;
  greetingMessage: string;
}
