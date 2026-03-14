"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, alias, password }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al registrar el usuario");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000); 

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Decorative subtle glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full" />

        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 relative">
          Crear Cuenta
        </h1>
        <p className="text-slate-400 mb-8 relative">Únete para empezar a crear proyectos</p>
        
        {error && (
           <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
            ¡Cuenta creada! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5 relative">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-100 placeholder-slate-500 transition-all shadow-inner"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Alias (Username)</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="w-full p-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-100 placeholder-slate-500 transition-all shadow-inner"
              placeholder="Ej: Mayco"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-slate-100 placeholder-slate-500 transition-all shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-cyan-400 hover:to-blue-500 focus:ring-4 focus:ring-cyan-500/30 transition-all transform active:scale-[0.98] shadow-lg shadow-cyan-500/25 mt-4"
          >
            {loading ? "Creando..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400 relative">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-colors">
            Iniciá sesión acá
          </Link>
        </div>
      </div>
    </main>
  );
}