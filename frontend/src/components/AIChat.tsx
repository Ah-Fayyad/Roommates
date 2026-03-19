import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../components/ui/Button';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}


const AIChat = () => {
    const { t, i18n } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: t('ai_welcome_message'),
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // Update welcome message when language changes if it's the only message
    useEffect(() => {
        if (messages.length === 1 && messages[0].id === '1') {
            setMessages([{
                id: '1',
                text: t('ai_welcome_message'),
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    }, [i18n.language]);

    // ...

    const quickQuestions = [
        t('qq_find_roommate'),
        t('qq_ask_roommate'),
        t('qq_living_tips'),
        t('qq_split_bills')
    ];

    const getBotResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('find') && lowerMessage.includes('roommate')) {
            return "To find a compatible roommate, I recommend:\n\n1. **Use our Smart Matching**: Our AI analyzes your lifestyle, habits, and preferences\n2. **Be Specific**: Fill out your profile completely with your habits and preferences\n3. **Browse Verified Profiles**: Look for verified student profiles\n4. **Ask Questions**: Use our chat feature to get to know potential roommates\n5. **Meet in Person**: Always meet in a public place before making decisions\n\nWould you like help setting up your profile for better matches?";
        }

        if (lowerMessage.includes('ask') || lowerMessage.includes('question')) {
            return "Great question! Here are important questions to ask potential roommates:\n\n**Lifestyle:**\n• What's your sleep schedule?\n• How clean do you keep shared spaces?\n• Do you have pets?\n• Do you smoke or drink?\n\n**Practical:**\n• How do you prefer to split bills?\n• What's your budget for rent and utilities?\n• How long are you planning to stay?\n\n**Social:**\n• Do you like having guests over?\n• Are you more introverted or extroverted?\n• What are your hobbies?\n\nWant me to help you prepare for a roommate interview?";
        }

        if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('living')) {
            return "Here are my top tips for successful roommate living:\n\n✨ **Communication is Key**\n• Have regular house meetings\n• Address issues early and respectfully\n• Use a shared calendar for chores\n\n🏠 **Respect Boundaries**\n• Knock before entering rooms\n• Respect quiet hours\n• Ask before using others' belongings\n\n💰 **Financial Clarity**\n• Split bills fairly and on time\n• Keep receipts for shared expenses\n• Use apps like Splitwise\n\n🧹 **Cleanliness**\n• Create a cleaning schedule\n• Clean as you go\n• Respect shared spaces\n\nNeed specific advice on any of these topics?";
        }

        if (lowerMessage.includes('bill') || lowerMessage.includes('split') || lowerMessage.includes('money')) {
            return "Here's how to handle bills fairly:\n\n💳 **Best Practices:**\n1. **Equal Split**: Divide all bills equally if rooms are similar\n2. **Proportional**: Split based on room size or income\n3. **Use Apps**: Try Splitwise, Venmo, or PayPal for tracking\n\n📊 **What to Split:**\n• Rent (usually equal or by room size)\n• Utilities (electricity, water, internet)\n• Shared supplies (cleaning products, toilet paper)\n• Shared subscriptions (Netflix, etc.)\n\n⚠️ **Tips:**\n• Set up automatic payments\n• Keep a shared spreadsheet\n• Discuss and agree on everything upfront\n• Have a buffer fund for emergencies\n\nWant help creating a bill-splitting agreement?";
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! 👋 I'm here to help you with anything related to finding roommates and living together. You can ask me about:\n\n• Finding compatible roommates\n• Questions to ask potential roommates\n• Tips for living together\n• How to split bills\n• Dealing with conflicts\n• And much more!\n\nWhat would you like to know?";
        }

        if (lowerMessage.includes('thank')) {
            return "You're very welcome! 😊 I'm always here to help. Feel free to ask me anything else about roommates, or check out our listings to find your perfect match. Good luck with your search!";
        }

        return "That's an interesting question! While I'm still learning, I can help you with:\n\n• Finding compatible roommates\n• Roommate interview questions\n• Living together tips\n• Bill splitting advice\n• Conflict resolution\n\nCould you rephrase your question or choose one of these topics? I'm here to help! 🏠";
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call backend AI API
            const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
                message: input,
                conversationHistory: messages.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                }))
            });

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.message,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('AI Chat Error:', error);
            // Fallback to error message
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuestion = (question: string) => {
        setInput(question);
    };

    if (isMinimized) {
        return (
            <button
                onClick={() => setIsMinimized(false)}
                className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl transition-all hover:scale-110"
            >
                <Bot className="h-8 w-8" />
                <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-green-500"></div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-96 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
            {/* Header */}
            <div className="gradient-primary flex items-center justify-between p-4 text-white">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                            <Bot className="h-6 w-6" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                    </div>
                    <div>
                        <h3 className="font-bold">{t('ai_assistant')}</h3>
                        <p className="text-xs text-white/80">{t('always_here_to_help')}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="rounded-lg p-2 transition-colors hover:bg-white/20"
                    >
                        <Minimize2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 animate-fadeInUp ${message.sender === 'user' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${message.sender === 'bot'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            {message.sender === 'bot' ? (
                                <Bot className="h-5 w-5 text-white" />
                            ) : (
                                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            )}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.sender === 'bot'
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            }`}>
                            <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                            <p className={`mt-1 text-xs ${message.sender === 'bot'
                                ? 'text-gray-500 dark:text-gray-400'
                                : 'text-white/70'
                                }`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 animate-fadeInUp">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                            <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                            <div className="flex gap-1">
                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }}></div>
                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }}></div>
                                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
                <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{t('quick_questions')}</p>
                    <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickQuestion(question)}
                                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 transition-all hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('ask_anything')}
                        className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        variant="gradient"
                        size="icon"
                        className="h-10 w-10 flex-shrink-0"
                    >
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
