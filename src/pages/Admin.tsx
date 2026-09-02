import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { Article } from "../types";
import { Activity, Plus, Trash2, LogOut } from "lucide-react";

export function Admin() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visits, setVisits] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Editor state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState<Article['type']>('article');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    // Load visits
    try {
      const snap = await getDoc(doc(db, "analytics", "global"));
      if (snap.exists()) setVisits(snap.data().visits || 0);
    } catch(e) {}

    // Load articles
    try {
      const qSnap = await getDocs(collection(db, "articles"));
      setArticles(qSnap.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
    } catch(e) {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "articles"), {
        title,
        content,
        imageUrl,
        type,
        createdAt: Date.now()
      });
      alert("Published successfully!");
      setTitle("");
      setContent("");
      setImageUrl("");
      loadData();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "articles", id));
      loadData();
    } catch(e: any) {
      alert("Error: " + e.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-black/40 backdrop-blur-3xl p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h2 className="text-4xl font-cursive font-bold text-center text-white mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 shadow-inner text-slate-200 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm placeholder-slate-500" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 shadow-inner text-slate-200 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm placeholder-slate-500" required />
          </div>
          <button className="w-full bg-cyan-600 text-white font-bold py-3 text-xs tracking-tighter uppercase rounded-xl hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-500/20 border border-cyan-500/50 mt-2">
            Sign In
          </button>
        </form>
        <div className="mt-6 text-[10px] text-slate-500 text-center uppercase tracking-wider">
          Note: Use Firebase Authentication to create an admin user in your Firebase console.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-black/40 backdrop-blur-3xl p-6 rounded-3xl text-white border border-white/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-cursive font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">Manage site content and analytics</p>
        </div>
        <button onClick={() => signOut(auth)} className="relative z-10 flex items-center gap-2 bg-white/5 hover:bg-white/10 shadow-sm px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors">
          <LogOut className="w-3 h-3" /> Logout
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        
        {/* Stats */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-black/40 backdrop-blur-3xl shadow-2xl p-6 rounded-3xl border border-white/10 relative overflow-hidden">
            <p className='text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2'>Live Stats</p>
            <div className="flex justify-between items-end">
              <span className="text-4xl font-mono text-cyan-400 font-bold">{visits}</span>
            </div>
            <p className='text-[10px] text-slate-500 mt-2'>Total Global Visits</p>
          </div>

          <div className="bg-black/40 backdrop-blur-3xl shadow-2xl p-6 rounded-3xl border border-white/10">
            <h4 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2'>Published Content</h4>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {articles.map(a => (
                <div key={a.id} className="flex justify-between items-start border-l-2 border-white/20 pl-3 py-1 hover:border-cyan-500 group transition-colors">
                  <div>
                    <p className="text-xs font-medium text-slate-300 line-clamp-1 group-hover:text-white transition-colors">{a.title}</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase">{a.type}</p>
                  </div>
                  <button onClick={() => a.id && handleDelete(a.id)} className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="md:col-span-3 bg-black/40 backdrop-blur-3xl shadow-2xl p-8 rounded-3xl border border-white/10">
          <h4 className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/10 pb-2 flex items-center gap-2'>
            <Plus className="w-4 h-4 text-cyan-400" /> Publish New Content
          </h4>
          <form onSubmit={handlePublish} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-slate-200 shadow-inner rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Type</label>
                <select value={type} onChange={e=>setType(e.target.value as any)} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-slate-200 shadow-inner rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm appearance-none">
                  <option value="article">Article</option>
                  <option value="interview_question">Interview Question</option>
                  <option value="common_question">Common Question</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Image URL (Optional)</label>
              <input type="url" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-slate-200 shadow-inner rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm placeholder-slate-500" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Content (Markdown supported)</label>
              <textarea value={content} onChange={e=>setContent(e.target.value)} required rows={12} className="w-full px-4 py-3 bg-black/40 border border-white/10 shadow-inner text-slate-200 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm leading-relaxed placeholder-slate-500" placeholder="# Heading..." />
            </div>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold py-3 text-xs uppercase tracking-tighter rounded-xl transition-all border border-cyan-500/50 mt-2">
              Publish Content
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
