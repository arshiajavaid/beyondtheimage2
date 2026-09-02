import { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { MessageSquare, Send } from "lucide-react";

export function Queries() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // To display public common questions if needed
  const [publicQueries, setPublicQueries] = useState<any[]>([]);

  useEffect(() => {
    // Only showing recent generic queries as examples of "reach out"
    const q = query(collection(db, "queries"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPublicQueries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSubmitting(true);
    try {
      await addDoc(collection(db, "queries"), {
        name,
        email,
        message,
        createdAt: Date.now()
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Error submitting query");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-start">
      
      {/* Contact Form */}
      <div className="col-span-8 bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl p-8 relative">
        <h4 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-2 flex items-center gap-2'>
          <MessageSquare className="w-4 h-4 text-cyan-400" /> Reach Out
        </h4>
        
        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
          Have a suggestion, a topic request, or a general query? Drop us a message below.
        </p>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl mb-6 text-sm font-medium shadow-sm">
            Thank you! Your message has been sent successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 shadow-inner text-slate-200 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm placeholder-slate-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 shadow-inner text-slate-200 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm placeholder-slate-500"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message / Suggestion</label>
            <textarea
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-black/40 border border-white/10 shadow-inner text-slate-200 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none text-sm leading-relaxed placeholder-slate-500"
              placeholder="What's on your mind?"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold text-xs uppercase tracking-tighter py-3 rounded-xl transition-all flex justify-center items-center gap-2 border border-cyan-500/50 mt-2"
          >
            {submitting ? "Sending..." : <>Send Message <Send className="w-3 h-3" /></>}
          </button>
        </form>
      </div>

      {/* Recent Activity / Community */}
      <div className="col-span-4 space-y-6">
        <div className='flex-1 bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl p-6'>
          <h4 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-2'>Active Queries</h4>
          <div className="space-y-4">
            {publicQueries.slice(0, 5).map(q => (
              <div key={q.id} className="border-l-2 border-white/20 pl-4 py-1 hover:border-cyan-500 transition-colors group">
                <p className="text-xs text-slate-300 font-medium group-hover:text-white transition-colors">{q.message}</p>
                <p className="text-[10px] text-slate-500 mt-1">Requested by {q.name} • {new Date(q.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {publicQueries.length === 0 && (
              <p className="text-slate-500 text-xs italic">No queries yet. Be the first to reach out!</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
