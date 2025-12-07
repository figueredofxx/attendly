
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { ChatSession, Message, Patient } from '../types';
import { Button } from './ui/Button';
import { generateChatReply } from '../services/geminiService';
import { Send, CheckCheck, MoreVertical, Phone, BrainCircuit } from 'lucide-react';
import { MOCK_PATIENTS, MOCK_CHATS } from '../mocks';

interface ChatViewProps {
  onSelectPatient: (patient: Patient) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ onSelectPatient }) => {
    const [selectedChatId, setSelectedChatId] = useState<string>('c2');
    const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
    const [inputText, setInputText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const activeChat = chats.find(c => c.id === selectedChatId);

    const handleSendMessage = (text: string, sender: 'user' | 'ai' = 'ai') => {
        if (!activeChat) return;
        
        const newMessage: Message = {
            id: Date.now().toString(),
            sender,
            text,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: 'sent'
        };

        const updatedChats = chats.map(c => {
            if (c.id === selectedChatId) {
                return { ...c, messages: [...c.messages, newMessage], lastMessage: text, unreadCount: 0 };
            }
            return c;
        });

        setChats(updatedChats);
        setInputText('');
    };

    const handleAIGenerate = async () => {
        if (!activeChat) return;
        setIsGenerating(true);
        const reply = await generateChatReply(activeChat.messages, activeChat.patientName);
        setInputText(reply);
        setIsGenerating(false);
    };

    const handleOpenProfile = () => {
        if (activeChat) {
            const patient = MOCK_PATIENTS[activeChat.patientId];
            if (patient) onSelectPatient(patient);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
            {/* Sidebar Chat List */}
            <Card className="w-full md:w-80 flex flex-col overflow-hidden p-0 border-r border-zinc-200">
                <div className="p-4 border-b border-zinc-200 bg-zinc-50">
                    <h3 className="font-bold text-zinc-900">Conversas Ativas</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => (
                        <div 
                            key={chat.id}
                            onClick={() => setSelectedChatId(chat.id)}
                            className={`p-4 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors ${selectedChatId === chat.id ? 'bg-zinc-100' : ''}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className={`font-semibold text-sm ${selectedChatId === chat.id ? 'text-zinc-900' : 'text-zinc-600'}`}>{chat.patientName}</span>
                                <span className="text-[10px] text-zinc-400">{chat.messages[chat.messages.length-1].timestamp}</span>
                            </div>
                            <p className="text-xs text-zinc-500 truncate">{chat.lastMessage}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden p-0 border border-zinc-200 shadow-lg">
                {activeChat ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-white z-10">
                            <div className="flex items-center gap-3 cursor-pointer" onClick={handleOpenProfile}>
                                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                                    {activeChat.patientName.substring(0,1)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 hover:underline">{activeChat.patientName}</h3>
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    className="h-9 px-3 gap-2 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                    onClick={handleOpenProfile}
                                >
                                    <BrainCircuit size={14} /> Memória IA
                                </Button>
                                <Button variant="outline" className="h-9 w-9 p-0 rounded-lg flex items-center justify-center"><Phone size={16} /></Button>
                                <Button variant="outline" className="h-9 w-9 p-0 rounded-lg flex items-center justify-center"><MoreVertical size={16} /></Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50">
                            {activeChat.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm relative shadow-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-white text-zinc-800 rounded-tl-none border border-zinc-200' 
                                            : 'bg-zinc-900 text-white rounded-tr-none'
                                    }`}>
                                        <p>{msg.text}</p>
                                        <div className={`flex justify-end items-center gap-1 mt-1 text-[10px] ${msg.sender === 'user' ? 'text-zinc-400' : 'text-zinc-300'}`}>
                                            <span>{msg.timestamp}</span>
                                            {msg.sender === 'ai' && <CheckCheck size={12} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-zinc-200">
                             <div className="flex gap-2 items-end">
                                <div className="flex-1 relative">
                                    <textarea 
                                        className="w-full resize-none bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-zinc-300 focus:outline-none text-zinc-900"
                                        rows={2}
                                        placeholder="Digite uma mensagem ou peça para a IA..."
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                    />
                                    <button 
                                        className="absolute right-3 bottom-3 text-xs font-bold text-zinc-500 hover:text-zinc-800 uppercase tracking-wider transition-colors"
                                        onClick={handleAIGenerate}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? 'Gerando...' : '✨ Usar IA'}
                                    </button>
                                </div>
                                <Button 
                                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                                    onClick={() => handleSendMessage(inputText)}
                                    disabled={!inputText.trim()}
                                >
                                    <Send size={20} className="ml-1" />
                                </Button>
                             </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-400">
                        Selecione uma conversa
                    </div>
                )}
            </Card>
        </div>
    );
};
