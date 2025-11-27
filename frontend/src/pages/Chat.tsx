import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { socketService } from '../services/socket.service';
import axios from 'axios';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    read: boolean;
}

interface ChatUser {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
    lastMessage?: string;
    unreadCount: number;
}

const Chat = () => {
    const { chatId } = useParams();
    const { user, token } = useAuth();
    const [selectedChat, setSelectedChat] = useState<string | null>(chatId || null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [chats, setChats] = useState<ChatUser[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Socket
    useEffect(() => {
        if (token) {
            socketService.connect(token);

            socketService.on('new_message', (msg: any) => {
                if (msg.chatId === selectedChat) {
                    setMessages(prev => [...prev, {
                        id: msg.id,
                        senderId: msg.fromUserId,
                        text: msg.body,
                        timestamp: new Date(msg.createdAt),
                        read: false
                    }]);
                }
                // Update chat list last message
                fetchChats();
            });

            socketService.on('user_online', () => fetchChats());
            socketService.on('user_offline', () => fetchChats());
        }

        return () => {
            socketService.disconnect();
        };
    }, [token, selectedChat]);

    // Fetch Chats
    const fetchChats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/chats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Transform API data to ChatUser interface
            // This assumes the API returns a list of chats with participant info
            setChats(response.data);
        } catch (error) {
            console.error('Failed to fetch chats', error);
        }
    };

    useEffect(() => {
        if (token) fetchChats();
    }, [token]);

    // Fetch Messages when chat selected
    useEffect(() => {
        if (selectedChat && token) {
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/chats/${selectedChat}/messages`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMessages(response.data.map((m: any) => ({
                        id: m.id,
                        senderId: m.fromUserId,
                        text: m.body,
                        timestamp: new Date(m.createdAt),
                        read: m.read
                    })));
                } catch (error) {
                    console.error('Failed to fetch messages', error);
                }
            };
            fetchMessages();
        }
    }, [selectedChat, token]);

    const handleSend = async () => {
        if (!message.trim() || !selectedChat) return;

        const activeChatUser = chats.find(c => c.id === selectedChat);
        if (!activeChatUser) return;

        try {
            // Send via Socket
            socketService.emit('send_message', {
                chatId: selectedChat,
                toUserId: activeChatUser.id, // Assuming chat ID is user ID for direct messages or handle accordingly
                body: message
            });

            // Optimistic update
            const newMessage: Message = {
                id: Date.now().toString(),
                senderId: user?.id || 'me',
                text: message,
                timestamp: new Date(),
                read: false
            };

            setMessages([...messages, newMessage]);
            setMessage('');

            // Also save to DB via API if socket doesn't handle persistence automatically (it usually should, but good to ensure)
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const activeChat = chats.find(c => c.id === selectedChat);
    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar - Chat List */}
            <div className={`glass w-full border-r border-gray-200 dark:border-gray-700 md:w-96 ${selectedChat ? 'hidden md:block' : 'block'
                }`}>
                {/* Search */}
                <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white py-2 pl-10 pr-4 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
                    {filteredChats.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full border-b border-gray-200 p-4 text-left transition-all hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50 ${selectedChat === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={chat.avatar || 'https://via.placeholder.com/100'}
                                        alt={chat.name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                    {chat.online && (
                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-800"></div>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {chat.name}
                                        </h3>
                                        {chat.unreadCount > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                                        {chat.lastMessage}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                    {filteredChats.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            No conversations found
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedChat && activeChat ? (
                <div className="flex flex-1 flex-col">
                    {/* Chat Header */}
                    <div className="glass flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedChat(null)}
                                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <img
                                src={activeChat.avatar || 'https://via.placeholder.com/100'}
                                alt={activeChat.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {activeChat.name}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {activeChat.online ? 'Online' : 'Offline'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                                <Phone className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Video className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900/50">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex animate-fadeInUp ${msg.senderId === user?.id || msg.senderId === 'me' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.senderId === user?.id || msg.senderId === 'me'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                            : 'bg-white text-gray-900 dark:bg-gray-800 dark:text-white'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p
                                            className={`mt-1 text-xs ${msg.senderId === user?.id || msg.senderId === 'me'
                                                ? 'text-white/70'
                                                : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            {msg.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <div className="glass border-t border-gray-200 p-4 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type a message..."
                                className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            />
                            <Button variant="ghost" size="icon">
                                <Smile className="h-5 w-5" />
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={!message.trim()}
                                variant="gradient"
                                size="icon"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="hidden flex-1 items-center justify-center md:flex">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                            <Send className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                            Select a conversation
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Choose a chat from the sidebar to start messaging
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;

