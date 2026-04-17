"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default function TaskDetailsPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const taskId = params.id;
  const router = useRouter();

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/comments/task/${taskId}`, {
          credentials: "include", // envía la httpOnly cookie automáticamente
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Error al cargar comentarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId, router]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: newComment,
          task_id: parseInt(taskId as string),
        }),
      });

      if (response.ok) {
        const created = await response.json();
        setComments([...comments, created]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* CABECERA */}
        <div className="flex flex-col gap-4">
          <button onClick={() => router.back()} className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-2 transition-colors w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Volver a las Tareas
          </button>
          
          <div className="bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-violet-500/20 text-violet-400 rounded-md text-sm font-mono border border-violet-500/30">TAREA #{taskId}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-2">Detalles de la Tarea</h1>
              <p className="text-slate-400 mt-2 text-lg">Acá podés colaborar con tu equipo dejando notas o actualizaciones de estado.</p>
            </div>
          </div>
        </div>

        {/* ZONA DE COMENTARIOS (CHAT-STYLE) */}
        <section className="bg-slate-900/40 backdrop-blur-lg rounded-2xl border border-slate-700/50 shadow-lg flex flex-col h-[600px] overflow-hidden">
          {/* Header del Chat */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700/50">
            <h2 className="text-lg font-bold text-slate-200">Discusión y Notas</h2>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
            {comments.length === 0 ? (
              <div className="m-auto text-center p-8 bg-slate-800/40 rounded-2xl border border-slate-700 border-dashed">
                <p className="text-slate-400">Nadie ha comentado todavía.</p>
                <p className="text-slate-500 text-sm mt-1">Sumergite y dejá el primer progreso.</p>
              </div>
            ) : (
              comments.map((comment: any, idx: number) => (
                <div key={comment.id || idx} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                    <UserIcon />
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 w-fit max-w-2xl shadow-sm">
                    <p className="text-xs text-violet-300 font-bold mb-1 flex justify-between capitalize">
                       {comment.author?.alias || `Usuario #${comment.author_id}`}
                    </p>
                    <p className="text-slate-200 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Chat */}
          <div className="p-4 bg-slate-800/80 border-t border-slate-700/50">
            <form onSubmit={handleCreateComment} className="flex gap-3">
              <input 
                type="text" 
                placeholder="Escribe un comentario o avance..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                className="flex-1 p-3.5 bg-slate-900/80 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 text-slate-100 placeholder-slate-500" 
                required 
              />
              <button 
                type="submit" 
                className="bg-violet-600 hover:bg-violet-500 text-white font-bold p-3.5 rounded-xl transition-all shadow-lg active:scale-[0.95] shrink-0"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </section>

      </div>
    </main>
  );
}
