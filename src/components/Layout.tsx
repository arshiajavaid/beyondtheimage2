import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { Activity, Brain, FileText, Home, MessageSquare, ShieldAlert, Database } from "lucide-react";

export function Layout() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Articles", path: "/articles", icon: FileText },
    { name: "AI Assistant", path: "/ai", icon: Brain },
    { name: "Queries", path: "/queries", icon: MessageSquare },
    { name: "Admin", path: "/admin", icon: Database },
  ];

  return (
    <div className='flex h-screen w-full bg-slate-900/40 text-slate-200 font-sans overflow-hidden'>
      <aside className='w-64 bg-black/40 backdrop-blur-3xl border-r border-white/10 shadow-2xl flex flex-col p-6 space-y-8 flex-shrink-0 z-20'>
        <div className='space-y-1'>
          <h1 className='text-4xl font-cursive font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 leading-none pb-2'>Radiology</h1>
          <p className='text-[10px] font-bold tracking-[0.2em] text-cyan-500/70 uppercase mt-1'>Beyond The Image</p>
        </div>
        <nav className='flex-1 space-y-2'>
          <div className='p-3 bg-cyan-500/10 border-l-2 border-cyan-500 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4'>Navigation</div>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "p-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3",
                location.pathname === item.path
                  ? "bg-white/10 shadow-sm text-cyan-300 border border-white/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className='flex-1 flex flex-col relative h-full overflow-hidden'>
        <div className='absolute top-0 right-0 left-0 bg-black/40 backdrop-blur-md border-b border-white/10 px-8 py-2 text-center z-10 shadow-sm'>
          <span className='text-[10px] font-black tracking-[0.3em] text-amber-500/90 uppercase flex items-center justify-center gap-2'>
            <ShieldAlert className="h-3 w-3" />
            STRICTLY NOT FOR DIAGNOSIS — FOR EDUCATIONAL PURPOSES ONLY
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 pt-16 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
