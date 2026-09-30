export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  greetingMessage: string;
  systemPrompt: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'character';
  text: string;
  timestamp: string;
}
