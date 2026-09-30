import { GoogleGenAI } from '@google/genai';

export const sendMessageToGemini = async (
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: { sender: string; text: string }[]
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const formattedHistory = history
      .map((msg) => `${msg.sender === 'user' ? 'User' : 'Character'}: ${msg.text}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nChat History:\n${formattedHistory}\nUser: ${userMessage}\nCharacter:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || '...';
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, I had trouble processing that request. Please check your API key.';
  }
};
      
