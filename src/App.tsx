import React, { useState } from 'react';
import { DEFAULT_CHARACTERS } from './data/defaultCharacters';
import { Character, Message } from './types';
import { sendMessageToGemini } from './utils/geminiService';

export default function App() {
  const [characters] = useState<Character[]>(DEFAULT_CHARACTERS);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharacter(char);
    if (!messages[char.id]) {
      setMessages((prev) => ({
        ...prev,
        [char.id]: [
          {
            id: '1',
            sender: 'character',
            text: char.greetingMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedCharacter) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentCharId = selectedCharacter.id;
    const history = messages[currentCharId] || [];

    setMessages((prev) => ({
      ...prev,
      [currentCharId]: [...(prev[currentCharId] || []), userMsg],
    }));

    const currentInput = input;
    setInput('');
    setLoading(true);

    const replyText = await sendMessageToGemini(
      apiKey,
      selectedCharacter.systemPrompt,
      currentInput,
      history
    );

    const charMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'character',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => ({
      ...prev,
      [currentCharId]: [...(prev[currentCharId] || []), charMsg],
    }));

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-pink-400">🍓 BerryChat</h1>
        <input
          type="password"
          placeholder="Enter Gemini API Key..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="bg-slate-700 text-xs px-3 py-1.5 rounded text-white border border-slate-600 focus:outline-none"
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 bg-slate-800/50 border-r border-slate-700 p-3 space-y-3 overflow-y-auto">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Characters</h2>
          {characters.map((char) => (
            <div
              key={char.id}
              onClick={() => handleSelectCharacter(char)}
              className={`flex items-center space-x-3 p-2.5 rounded-xl cursor-pointer transition ${
                selectedCharacter?.id === char.id ? 'bg-pink-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <img src={char.avatar} alt={char.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-sm">{char.name}</div>
                <div className="text-xs text-slate-300 opacity-80">{char.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col bg-slate-900">
          {selectedCharacter ? (
            <>
              <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center space-x-3">
                <img src={selectedCharacter.avatar} alt={selectedCharacter.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="font-bold text-sm">{selectedCharacter.name}</span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {(messages[selectedCharacter.id] || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                        msg.sender === 'user'
                          ? 'bg-pink-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-xs text-slate-500 italic">{selectedCharacter.name} is typing...</div>}
              </div>

              <div className="p-3 border-t border-slate-700 bg-slate-800 flex space-x-2">
                <input
                  type="text"
                  placeholder={`Message ${selectedCharacter.name}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl font-medium text-sm transition"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Select a character to start chatting ✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
    }
              
