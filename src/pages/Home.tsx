import { Link } from "react-router-dom";
import { Brain, FileText, Users } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <div className="bg-black/40 backdrop-blur-3xl shadow-2xl p-8 md:p-16 rounded-3xl border border-white/10 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-center">
          <h1 className="text-5xl md:text-6xl font-cursive font-bold text-white mb-4">
            Educational <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Platform v4.2</span>
          </h1>
          <div className="flex gap-4 mb-6 justify-center">
            <div className="bg-black/60 rounded-2xl p-4 border border-white/10 shadow-sm text-slate-300 text-sm font-mono text-left inline-block w-full max-w-md">
              <span className="text-cyan-400">$</span> Analyze the common radiological findings for pleural effusion...
            </div>
          </div>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            The premier educational platform for mastering radiological concepts. Explore articles, interview questions, and our specialized AI assistant.
          </p>
          <div className="pt-6 flex flex-wrap justify-center gap-4 items-center">
            <Link to="/ai" className="bg-cyan-600/80 hover:bg-cyan-500 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 border border-cyan-500/50">
               Consult AI
             </Link>
             <Link to="/articles" className="bg-white/5 hover:bg-white/10 text-slate-200 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all border border-white/10 shadow-sm backdrop-blur-md">
               Explore Articles
             </Link>
           </div>
           <p className="text-[10px] text-slate-500 italic mt-6">* Educational model trained on Radiology standard protocols</p>
         </div>
       </div>
 
       {/* Feature Grid */}
       <div className="grid md:grid-cols-3 gap-6">
         <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col justify-between h-48 hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all group">
           <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 font-bold group-hover:scale-110 transition-transform">
             <FileText className="w-5 h-5" />
           </div>
           <h3 className="font-cursive font-bold text-3xl leading-tight text-slate-200">Articles & Cases</h3>
           <p className="text-xs text-slate-400 mt-2">Deep dives into radiological concepts and case studies.</p>
         </div>
 
         <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col justify-between h-48 hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all group">
           <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4 text-cyan-400 font-bold group-hover:scale-110 transition-transform">
             <Brain className="w-5 h-5" />
           </div>
           <h3 className="font-cursive font-bold text-3xl leading-tight text-slate-200">AI Study Partner</h3>
           <p className="text-xs text-slate-400 mt-2">Reinforce your learning with our specialized educational AI.</p>
         </div>
 
         <div className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col justify-between h-48 hover:shadow-cyan-500/10 hover:border-cyan-500/30 transition-all group">
           <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400 font-bold group-hover:scale-110 transition-transform">
             <Users className="w-5 h-5" />
           </div>
           <h3 className="font-cursive font-bold text-3xl leading-tight text-slate-200">Community Queries</h3>
           <p className="text-xs text-slate-400 mt-2">Reach out with suggestions and see commonly asked topics.</p>
         </div>
       </div>
     </div>
   );
}
