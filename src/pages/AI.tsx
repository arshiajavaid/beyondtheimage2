import { useState, useRef, useEffect } from "react";
import { Brain, Send, ShieldAlert } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function AI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello. I am the RadiologyBeyondTheImage educational AI. I can answer questions about radiological concepts, physics, anatomy, and tools. **Please remember I am strictly for educational purposes and NOT for medical diagnosis.** How can I help you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput("");
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', content: "**Error:** I'm sorry, I couldn't process that request at the moment. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-black/40 backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
      
      {/* Header */}
      <div className="bg-black/20 p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 p-2.5 rounded-xl border border-cyan-500/30">
            <Brain className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-3xl font-cursive font-bold text-white">AI Clinical Assistant</h2>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Educational Model Interface</p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 flex items-center justify-center gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-500" />
        <p className="text-[10px] text-amber-500 font-black tracking-widest uppercase text-center">
          Strictly not for diagnosis. For educational purposes only.
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
              msg.role === 'user' 
                ? 'bg-cyan-600/90 text-white rounded-tr-none border border-cyan-500 shadow-md shadow-cyan-500/20' 
                : 'bg-black/60 text-slate-300 rounded-tl-none shadow-sm border border-white/10'
            }`}>
              <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-p:text-white prose-headings:text-white' : 'prose-invert prose-slate prose-a:text-cyan-400 prose-headings:text-white'}`}>
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-black/60 rounded-2xl p-4 rounded-tl-none border border-white/10 shadow-sm flex gap-2 items-center">
              <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/40 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about MRI sequences, CT physics, etc..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 shadow-inner rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 placeholder-slate-500 text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-colors shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-12 border border-cyan-500/50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
