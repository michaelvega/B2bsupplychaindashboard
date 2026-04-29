import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2, Bot, Plus, MessageSquare, MoreHorizontal, PenLine, Trash2, Share, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate, useParams } from 'react-router';
import { ThinkingTimer } from '../components/ThinkingTimer';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

const TARGET_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/chat';

export function Actions() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('agent_chats');
      if (saved) return JSON.parse(saved);
      
      // Fallback to old agent_messages for migration if agent_chats doesn't exist
      const oldMessages = localStorage.getItem('agent_messages');
      if (oldMessages) {
        const parsed = JSON.parse(oldMessages);
        if (parsed.length > 0) {
          const migratedChat: ChatSession = {
            id: crypto.randomUUID(),
            title: "Imported Chat",
            messages: parsed,
            updatedAt: Date.now(),
          };
          return [migratedChat];
        }
      }
    } catch (e) {
      console.error('Failed to load chats', e);
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(c => c.id === chatId);
  const messages = currentChat?.messages || [];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem('agent_chats', JSON.stringify(chats));
  }, [chats]);

  // Auto-redirect removed to allow "New Chat" to load an empty state.

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    let targetChatId = chatId;
    let isNewChat = false;

    if (!currentChat) {
      targetChatId = crypto.randomUUID();
      isNewChat = true;
    }

    const userMessage = messageText.trim();
    setInput('');
    setIsLoading(true);

    setChats(prev => {
      if (isNewChat) {
        return [{
          id: targetChatId!,
          title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : ''),
          messages: [{ role: 'user', content: userMessage }],
          updatedAt: Date.now()
        }, ...prev];
      } else {
        return prev.map(c => c.id === targetChatId ? {
          ...c,
          messages: [...c.messages, { role: 'user', content: userMessage }],
          updatedAt: Date.now()
        } : c);
      }
    });

    if (isNewChat) {
      navigate(`/command-center/${targetChatId}`);
    }

    try {
      const response = await fetch(TARGET_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.response || 'No response from agent.';

      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) {
        const parts = responseText.split('🦞');
        responseText = parts.slice(1).join('🦞').trim();
      }

      setChats(prev => prev.map(c => c.id === targetChatId ? {
        ...c,
        messages: [...c.messages, { role: 'agent', content: responseText }],
        updatedAt: Date.now()
      } : c));
    } catch (error) {
      console.error("Connection Failed:", error);
      setChats(prev => prev.map(c => c.id === targetChatId ? {
        ...c,
        messages: [...c.messages, { 
          role: 'agent', 
          content: `Error connecting to agent: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }],
        updatedAt: Date.now()
      } : c));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameSubmit = (id: string) => {
    if (editTitle.trim()) {
      setChats(prev => prev.map(c => c.id === id ? { ...c, title: editTitle.trim() } : c));
    }
    setEditingChatId(null);
  };

  const handleDelete = (id: string) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (chatId === id) {
      navigate('/command-center');
    }
    setMenuOpenId(null);
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/command-center/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setMenuOpenId(null);
  };

  return (
    <div className="flex h-full w-full bg-white">
      {/* Left Sidebar - Chat History */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col flex-shrink-0">
        <div className="p-4">
          <Button 
            onClick={() => navigate('/command-center')}
            className="w-full flex items-center justify-between gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm transition-colors rounded-lg h-10 px-3 font-medium"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Chat
            </div>
            <PenLine className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
          <div className="text-xs font-semibold text-gray-500 mb-3 px-2 mt-2">Previous Chats</div>
          {chats.sort((a,b) => b.updatedAt - a.updatedAt).map(chat => (
            <div 
              key={chat.id} 
              className={`relative group flex items-center gap-2 px-2 py-2.5 rounded-lg cursor-pointer transition-colors ${chatId === chat.id ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => {
                if (editingChatId !== chat.id) {
                  navigate(`/command-center/${chat.id}`);
                }
              }}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              
              {editingChatId === chat.id ? (
                <input
                  autoFocus
                  className="flex-1 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  onBlur={() => handleRenameSubmit(chat.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleRenameSubmit(chat.id);
                    if (e.key === 'Escape') setEditingChatId(null);
                  }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <div className="flex-1 truncate text-sm font-medium pr-6">
                  {chat.title}
                </div>
              )}

              {/* Chat Actions Menu Trigger */}
              {editingChatId !== chat.id && (
                <div 
                  className={`absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity ${menuOpenId === chat.id ? 'opacity-100' : ''}`}
                  onClick={e => { e.stopPropagation(); setMenuOpenId(menuOpenId === chat.id ? null : chat.id); }}
                >
                  <button className="p-1 rounded-md hover:bg-gray-300 text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {menuOpenId === chat.id && (
                    <div ref={menuRef} className="absolute right-0 top-6 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(chat.id); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        {copiedId === chat.id ? <Check className="w-4 h-4 text-green-500" /> : <Share className="w-4 h-4" />}
                        {copiedId === chat.id ? 'Copied!' : 'Share'}
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEditTitle(chat.title); 
                          setEditingChatId(chat.id); 
                          setMenuOpenId(null); 
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <PenLine className="w-4 h-4" />
                        Rename
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {chats.length === 0 && (
             <div className="text-sm text-gray-500 px-2 mt-4 text-center">No previous chats.</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header (optional, similar to ChatGPT) */}
        <div className="h-14 border-b border-gray-200 flex items-center px-6 flex-shrink-0 bg-white sticky top-0 z-10">
           <h2 className="text-lg font-semibold text-gray-800">{currentChat ? currentChat.title : 'New Chat'}</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
          <div className="max-w-3xl mx-auto space-y-6">
            {!currentChat || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500">
                <Bot className="w-16 h-16 mb-6 text-gray-300" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Agent Command Center</h1>
                <p className="text-gray-500 max-w-md">
                  Build an agent.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10 w-full max-w-2xl">
                  {[
                    'List my recent purchase orders',
                    'Check inventory for SKU #8842',
                    'Create a new purchase order for 500 units of Hydraulic Seals',
                    'Summarize the latest vendor delays'
                  ].map((cmd, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(cmd)}
                      className="px-4 py-3 text-sm text-left text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm flex items-center justify-between group"
                    >
                      <span className="line-clamp-2">{cmd}</span>
                      <Send className="w-4 h-4 text-gray-300 group-hover:text-gray-500 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex w-full mb-8 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'user' ? (
                    <div className="max-w-[80%] bg-gray-100 text-gray-900 px-5 py-3 rounded-3xl rounded-tr-sm">
                      <div className="whitespace-pre-wrap text-base">{msg.content}</div>
                    </div>
                  ) : (
                    <div className="flex w-full text-base leading-relaxed text-gray-800 gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({ node, ...props }) => <div className="overflow-x-auto my-6 rounded-lg border border-gray-200"><table className="w-full text-sm text-left" {...props} /></div>,
                              thead: ({ node, ...props }) => <thead className="text-xs text-gray-700 uppercase bg-gray-50" {...props} />,
                              tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
                              tr: ({ node, ...props }) => <tr className="bg-white" {...props} />,
                              th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold text-gray-900" {...props} />,
                              td: ({ node, ...props }) => <td className="px-4 py-3 text-gray-700" {...props} />,
                              p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 mb-4" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 mb-4" {...props} />,
                              li: ({ node, ...props }) => <li {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                              a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                              h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 border-b border-gray-200 pb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-4" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-5 mb-3" {...props} />,
                              code: ({node, ...props}) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 break-words" {...props} />,
                              pre: ({node, ...props}) => <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4" {...props} />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                        
                        {/* Approve/Deny Action Buttons */}
                        {index === messages.length - 1 && msg.role === 'agent' && msg.content.includes('Approve/Deny') && (
                          <div className="flex gap-3 mt-6">
                            <Button onClick={() => handleSend('Approve.')} className="bg-green-600 hover:bg-green-700 text-white shadow hover:shadow-md transition-all h-9 px-5 font-medium rounded-full">
                              Approve
                            </Button>
                            <Button onClick={() => handleSend('Deny.')} className="bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-md transition-all h-9 px-5 font-medium rounded-full">
                              Deny
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex w-full gap-4 mb-8 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-gray-500 text-sm font-medium"><ThinkingTimer /></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-white border border-gray-300 rounded-2xl shadow-sm focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400 transition-all overflow-hidden">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message the SAP ERP agent..."
                disabled={isLoading}
                rows={1}
                className="w-full resize-none bg-transparent py-4 pl-4 pr-14 focus:outline-none disabled:opacity-50 min-h-[56px] max-h-48 overflow-y-auto"
                style={{ fieldSizing: 'content' } as any}
              />
              <button 
                onClick={() => handleSend()} 
                disabled={!input.trim() || isLoading}
                className="absolute right-3 bottom-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-xl w-8 h-8 flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mt-3 text-xs text-gray-400">
              Agent can make mistakes. Consider verifying important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
