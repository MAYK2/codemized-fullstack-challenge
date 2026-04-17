"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TaskIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

const STATUS_CONFIG: Record<string, { label: string; classes: string; dot: string }> = {
  pending:     { label: "Pendiente",   classes: "bg-amber-500/10 text-amber-400 border-amber-500/20",       dot: "bg-amber-400 animate-pulse" },
  in_progress: { label: "En progreso", classes: "bg-blue-500/10 text-blue-400 border-blue-500/20",          dot: "bg-blue-400 animate-pulse" },
  done:        { label: "Completada",  classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
};

interface User {
  id: number;
  alias: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  assignee_id: number | null;
  assignee: User | null;
}

export default function ProjectTasksPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const projectId = params.id;
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar tareas y lista de usuarios en paralelo
        const [resTasks, resUsers] = await Promise.all([
          fetch(`http://localhost:8000/tasks/project/${projectId}`, {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("http://localhost:8000/users/", {
            credentials: "include",
          }),
        ]);

        if (resTasks.status === 401 || resUsers.status === 401) {
          router.push("/login");
          return;
        }

        if (resTasks.ok) setTasks(await resTasks.json());
        if (resUsers.ok) setUsers(await resUsers.json());
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          project_id: parseInt(projectId as string),
          assignee_id: assigneeId ? parseInt(assigneeId) : null,
          status,
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
        setAssigneeId("");
        setStatus("pending");
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Error al crear la tarea.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDeleteTask = async (e: React.MouseEvent, taskId: number) => {
    e.preventDefault();
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) return;

    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok || response.status === 204) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      } else {
        const errorData = await response.json();
        alert(errorData.detail || "Error al eliminar la tarea.");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* CABECERA Y VOLVER */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 transition-colors w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Volver al Dashboard
          </Link>

          <div className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-lg flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Tareas del Proyecto</h1>
              <p className="text-slate-500 text-sm mt-1">{tasks.length} tarea{tasks.length !== 1 ? "s" : ""} · {users.length} usuario{users.length !== 1 ? "s" : ""} en el sistema</p>
            </div>
          </div>
        </div>

        {/* CREADOR DE TAREAS */}
        <section className="bg-slate-900/40 backdrop-blur-lg p-6 rounded-2xl border border-slate-700/50 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

          <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-md"><PlusIcon /></div>
            Nueva Tarea
          </h2>

          <form onSubmit={handleCreateTask} className="flex flex-col gap-4 relative">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="¿Qué hay que hacer?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 p-3.5 bg-slate-950/50 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-100 placeholder-slate-500 transition-all font-medium"
                required
              />
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-[2] p-3.5 bg-slate-950/50 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-100 placeholder-slate-500 transition-all"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* DROPDOWN DE USUARIOS — reemplaza el input numérico */}
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full md:w-64 p-3.5 bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-100 transition-all cursor-pointer"
              >
                <option value="">👤 Asignar a... (yo mismo por defecto)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.alias} (ID: {u.id})
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full md:w-48 p-3.5 bg-slate-950/70 border border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-100 transition-all cursor-pointer"
              >
                <option value="pending">⏳ Pendiente</option>
                <option value="in_progress">🔄 En progreso</option>
                <option value="done">✅ Completada</option>
              </select>

              <button
                type="submit"
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-cyan-500/25 active:scale-[0.98] whitespace-nowrap"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        </section>

        {/* LISTA DE TAREAS */}
        <section>
          {tasks.length === 0 ? (
            <div className="text-center p-12 bg-slate-900/20 rounded-3xl border border-slate-800 border-dashed">
              <div className="flex justify-center text-slate-600 mb-4"><TaskIcon /></div>
              <p className="text-slate-400 text-lg">Este proyecto aún no tiene tareas.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const statusInfo = STATUS_CONFIG[task.status] ?? STATUS_CONFIG["pending"];
                return (
                  <Link href={`/task/${task.id}`} key={task.id} className="block group">
                    <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group-hover:bg-slate-800/80 group-hover:border-cyan-500/50 transition-all cursor-pointer relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-colors" />

                      <div className="relative flex items-center gap-4">
                        <div className="p-3 bg-slate-800 rounded-lg text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                          <TaskIcon />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-100 group-hover:text-cyan-300 transition-colors">{task.title}</h3>
                          {task.description && (
                            <p className="text-slate-400 text-sm mt-0.5 max-w-2xl truncate">{task.description}</p>
                          )}
                          {/* Asignado — ahora muestra el alias real */}
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <UserIcon />
                            <span className="text-xs text-slate-500">
                              {task.assignee
                                ? <span className="text-cyan-400/80 font-medium">{task.assignee.alias}</span>
                                : <span className="text-slate-600">Sin asignar</span>
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-700/50 pt-3 sm:pt-0 relative">
                        <span className={`${statusInfo.classes} border text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide flex items-center gap-1.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                          {statusInfo.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => handleDeleteTask(e, task.id)}
                            className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors z-10"
                            title="Eliminar tarea"
                          >
                            <TrashIcon />
                          </button>
                          <span className="text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all flex items-center gap-1">
                            Ver Detalles <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}