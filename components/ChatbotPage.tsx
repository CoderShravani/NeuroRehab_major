import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { User } from '../types';

// --- SVG Icons ---
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

// --- Interfaces ---
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatbotPageProps {
  user: User;
  onExit: () => void;
}

const ChatbotPage: React.FC<ChatbotPageProps> = ({ user, onExit }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const patientName = user.data?.fullName || 'the user';

  const systemInstruction = `You are a friendly and supportive AI assistant for NeuroRehab, a digital rehabilitation platform. Your user is ${patientName}, who is recovering from a neurological condition.
    Your role is to:
    1. Provide encouragement and motivational support.
    2. Answer general questions about neurological rehabilitation exercises and their benefits.
    3. Suggest fun ways to stay engaged with their therapy.
    4. Keep responses positive, empathetic, and relatively concise.
    
    IMPORTANT: You must NOT provide medical advice, diagnose conditions, or suggest specific treatment plans. If a user asks for medical advice (e.g., "Should I take this medicine?", "Why am I feeling this pain?"), you must gently decline and advise them to speak with their doctor or physiotherapist. For example: "That's a really important question, but it's best answered by your doctor who knows your specific situation. I'm here to help with exercise motivation and general info!"`;

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('neuroRehabChatSessions');
      if (storedSessions) {
        const parsedSessions: ChatSession[] = JSON.parse(storedSessions);
        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
          setActiveSessionId(parsedSessions[0].id);
        } else {
            handleNewChat();
        }
      } else {
        handleNewChat();
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
      handleNewChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if(sessions.length > 0) {
        localStorage.setItem('neuroRehabChatSessions', JSON.stringify(sessions));
      }
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [sessions]);
  
  const initChat = useCallback(() => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
        // Handle error, maybe show a message to the user
    }
  }, [systemInstruction]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Conversation',
      messages: [{ sender: 'bot', text: `Hello ${user.data?.fullName || ''}! I'm your NeuroRehab assistant. How can I help you on your recovery journey today?` }],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    initChat(); // Re-initialize chat for a fresh context
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !activeSessionId) return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    
    // Update state with user message
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMessage] } : s));
    setInputValue('');
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat not initialized");
      }
      
      const stream = await chatRef.current.sendMessageStream({ message: inputValue });

      let botResponse = '';
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, { sender: 'bot', text: '' }] } : s));

      for await (const chunk of stream) {
        botResponse += chunk.text;
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            const lastMessage = s.messages[s.messages.length - 1];
            const updatedMessages = [...s.messages.slice(0, -1), { ...lastMessage, text: botResponse }];
            return { ...s, messages: updatedMessages };
          }
          return s;
        }));
      }

    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, I seem to be having trouble connecting. Please try again in a moment.' };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMessage] } : s));
    } finally {
      setIsLoading(false);
    }
  };
  
  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="h-screen w-full flex bg-slate-200 font-sans">
      {/* Sidebar */}
      <div className={`absolute md:relative z-20 h-full bg-[#03045e] text-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 flex-shrink-0 flex flex-col`}>
        <div className="p-4 border-b border-blue-900 flex justify-between items-center">
          <h2 className="text-xl font-bold">Chat History</h2>
          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>&times;</button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => { setActiveSessionId(session.id); setIsSidebarOpen(false); }}
              className={`p-3 m-2 rounded cursor-pointer truncate ${activeSessionId === session.id ? 'bg-brand-primary' : 'hover:bg-blue-900'}`}
            >
              {session.messages[1]?.text || session.title}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-blue-900">
            <button onClick={handleNewChat} className="w-full flex items-center justify-center p-2 rounded bg-accent text-white hover:bg-brand-secondary transition-colors">
                <PlusIcon /> New Chat
            </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm p-3 flex items-center justify-between z-10">
          <button className="text-slate-600 hover:text-brand-primary" onClick={onExit}><BackIcon /></button>
          <span className="font-bold text-brand-dark text-lg">{activeSession?.messages[1]?.text.substring(0,30) || 'AI Assistant'}...</span>
          <button className="md:hidden text-slate-600 hover:text-brand-primary" onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {activeSession?.messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg lg:max-w-xl px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-white text-slate-800 shadow-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-lg lg:max-w-xl px-4 py-2 rounded-xl bg-white text-slate-800 shadow-sm">
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input Form */}
        <footer className="bg-white p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question or say hello..."
              className="flex-1 w-full px-4 py-2 bg-slate-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              disabled={isLoading}
              autoComplete="off"
            />
            <button type="submit" className="p-2 rounded-full bg-brand-primary text-white hover:bg-brand-dark disabled:bg-slate-400 transition-colors" disabled={isLoading || !inputValue.trim()}>
              <SendIcon />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatbotPage;