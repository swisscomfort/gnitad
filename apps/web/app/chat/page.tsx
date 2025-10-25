'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Conversation {
  id: string;
  otherUser: {
    id: string;
    pseudonym: string;
    primaryPhotoUrl?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchConversations();
  }, [token, router]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/chat/${userId}?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('http://localhost:3001/api/v1/chat/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedConversation,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-purple-600 transition"
            >
              ← Zurück
            </button>
            <h1 className="text-xl font-bold">Nachrichten</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Chat Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-96 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Konversationen durchsuchen..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <span className="text-4xl mb-2 block">💬</span>
                <p className="text-gray-500 mb-4">Noch keine Konversationen</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Matches ansehen
                </button>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.otherUser.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                    selectedConversation === conv.otherUser.id ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      {conv.otherUser.primaryPhotoUrl ? (
                        <img
                          src={conv.otherUser.primaryPhotoUrl}
                          alt={conv.otherUser.pseudonym}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-xl">🎭</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{conv.otherUser.pseudonym}</h3>
                        {conv.unreadCount > 0 && (
                          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-800 shadow'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            isOwn ? 'text-purple-200' : 'text-gray-500'
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="bg-white border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Nachricht schreiben..."
                    className="flex-1 px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Senden
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <span className="text-6xl mb-4 block">💬</span>
                <p>Wähle eine Konversation aus</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
