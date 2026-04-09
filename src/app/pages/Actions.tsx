import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '../components/ui/button';

interface Message {
  role: 'user' | 'agent';
  content: string;
}

const TARGET_URL = 'https://membrain-agent.jollyground-dd12577e.eastus.azurecontainerapps.io/api/chat';

export function Actions() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('agent_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load messages', e);
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    localStorage.setItem('agent_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

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

      // Parse and discard everything before and including the 🦞 emoji
      const lobsterIndex = responseText.indexOf('🦞');
      if (lobsterIndex !== -1) {
        const parts = responseText.split('🦞');
        // taking the remainder of the string after the first lobster emoji
        responseText = parts.slice(1).join('🦞').trim();
      }

      setMessages(prev => [...prev, { role: 'agent', content: responseText }]);
    } catch (error) {
      console.error("Connection Failed:", error);
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: `Error connecting to agent: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col w-full">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-gray-900">Command Center</h1>
        <p className="text-gray-600 mt-1">
          Instruct the SAP agent to perform CRUD operations on your ERP system
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col flex-1 min-h-0">
        
        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Bot className="w-12 h-12 mb-4 text-blue-100" />
              <p>No messages yet. Send an instruction to start interacting with the SAP ERP.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex w-full mb-10 last:mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl">
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  </div>
                ) : (
                  <div className="flex flex-col w-full text-base leading-relaxed text-gray-800">
                    <div className="prose prose-slate max-w-none">
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
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2 mb-4" {...props} />,
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
                        <Button onClick={() => handleSend('Approve.')} className="bg-green-600 hover:bg-green-700 text-white shadow hover:shadow-md transition-all h-10 px-6 font-medium">
                          Approve
                        </Button>
                        <Button onClick={() => handleSend('Deny.')} className="bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-md transition-all h-10 px-6 font-medium">
                          Deny
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center mb-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-gray-500 text-base font-medium">Generating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Example Commands */}
        {messages.length === 0 && (
          <div className="border-t border-gray-200 bg-gray-50 flex-shrink-0 px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Example Commands</h3>
            <div className="flex flex-wrap gap-2">
              {[
                'List my recent purchase orders',
                'Check inventory for SKU #8842',
                'Create a new purchase order for 500 units of Hydraulic Seals',
              ].map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(cmd)}
                  className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors whitespace-nowrap"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <input
              type="text"
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
              className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={!input.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0 flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
