"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>;

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState(""); 
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar sesión — si la cookie no existe, el backend responderá 401
        const resUser = await fetch("http://localhost:8000/users/me", {
          credentials: "include", // envía la httpOnly cookie automáticamente
        });

        if (!resUser.ok) {
          router.push("/login");
          return;
        }

        const userData = await resUser.json();
        setUsername(userData.alias);

        const resProj = await fetch("http://localhost:8000/projects/my-projects", {
          credentials: "include",
        });

        if (resProj.ok) {
          const data = await resProj.json();
          setProjects(data);
        } else if (resProj.status === 401) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include", // envía la cookie para que el backend la borre
    });
    router.push("/login");
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!title.trim() || !description.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/projects/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setTitle("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error al crear:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* NAV CABECERA */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Mis Proyectos
            </h1>
            <p className="text-slate-400 mt-1 sm:text-lg">Hola, <span className="text-slate-200 font-bold capitalize">{username}</span> 👋</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="mt-4 sm:mt-0 bg-slate-800 hover:bg-slate-700/80 text-rose-400 hover:text-rose-300 border border-slate-700/50 hover:border-rose-500/30 px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <LogOutIcon /> Cerrar Sesión
          </button>
        </header>

        {/* CREAR PROYECTO */}
        <section className="bg-slate-900/40 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
           
          <div className="flex items-center gap-3 mb-6 relative">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <PlusIcon />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Nuevo Proyecto</h2>
          </div>

          <form onSubmit={handleCreateProject} className="flex flex-col md:flex-row gap-4 relative">
            <input 
              type="text" 
              placeholder="Título brillante..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="flex-1 p-4 bg-slate-950/50 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-100 placeholder-slate-500 shadow-inner transition-all" 
              required 
            />
            <input 
              type="text" 
              placeholder="¿De qué trata este proyecto?" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="flex-[2] p-4 bg-slate-950/50 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-100 placeholder-slate-500 shadow-inner transition-all" 
              required 
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center whitespace-nowrap"
            >
              Crear Proyecto
            </button>
          </form>
        </section>

        {/* LISTADO DE PROYECTOS */}
        <section>
          {projects.length === 0 ? (
            <div className="text-center p-12 bg-slate-900/20 rounded-3xl border border-slate-800 border-dashed">
              <FolderIcon />
              <p className="mt-4 text-slate-400 text-lg">Tu espacio de trabajo está vacío.</p>
              <p className="text-slate-500">Crea tu primer proyecto arriba para empezar a organizar tus tareas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <Link href={`/project/${project.id}`} key={project.id} className="group h-full flex mt-2">
                  <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-slate-700/50 group-hover:bg-slate-800/60 group-hover:border-indigo-500/50 transition-all duration-300 cursor-pointer h-full w-full flex flex-col justify-between shadow-lg relative overflow-hidden">
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/10 group-hover:to-violet-500/10 transition-colors duration-500" />
                    
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 group-hover:text-indigo-400 group-hover:border-indigo-500/50 transition-colors">
                        <FolderIcon />
                      </div>
                      <h2 className="text-xl font-bold text-slate-100 mb-2 truncate group-hover:text-indigo-300 transition-colors">{project.title}</h2>
                      <p className="text-slate-400 line-clamp-2">{project.description}</p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center relative">
                      <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 rounded-md text-slate-500">ID: {project.id}</span>
                      <span className="text-indigo-400 text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Ver Tareas
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}