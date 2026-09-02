import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Article } from "../types";
import { format } from "date-fns";
import { FileText, Search } from "lucide-react";
import Markdown from "react-markdown";

export function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(data);
    });
    return () => unsubscribe();
  }, []);

  const filtered = articles.filter(a => {
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-cursive font-bold text-white flex items-center gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            Educational Hub
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Explore articles, interview prep, and common questions.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 text-slate-200 placeholder-slate-500 rounded-xl focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none w-full sm:w-48 text-sm shadow-sm"
            />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="bg-black/40 backdrop-blur-md border border-white/10 text-slate-200 rounded-xl px-4 py-2 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm appearance-none shadow-sm"
          >
            <option value="all">All Content</option>
            <option value="article">Articles</option>
            <option value="interview_question">Interview Questions</option>
            <option value="common_question">Common Questions</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-sm text-sm">
            No articles found matching your criteria.
          </div>
        ) : (
          filtered.map(article => (
            <article key={article.id} className="bg-black/40 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {article.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">
                  {format(article.createdAt, 'MMM d, yyyy')}
                </span>
              </div>
              <h2 className="text-3xl font-cursive font-bold text-white mb-4">{article.title}</h2>
              {article.imageUrl && (
                <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover rounded-xl mb-6 bg-black/50 border border-white/5 shadow-inner" />
              )}
              <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-100 prose-a:text-cyan-400 text-slate-300 text-sm leading-relaxed">
                <Markdown>{article.content}</Markdown>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
