import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup">(params.get("mode") === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Conta criada! Você já pode acessar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-20 w-[500px] h-[500px] bg-primary/30 animate-blob" />
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-accent/25 animate-blob" style={{ animationDelay: "5s" }} />

      <div className="relative w-full max-w-md animate-fade-up">
        <Link to="/" className="flex justify-center mb-8"><Logo /></Link>

        <div className="glass-strong rounded-[2rem] p-8 shadow-glass">
          <h1 className="font-serif text-3xl mb-1 text-center">
            {mode === "signup" ? "Criar conta" : "Bem-vindo"}
          </h1>
          <p className="text-muted-foreground text-center mb-6 text-sm">
            {mode === "signup" ? "Comece sua análise em segundos" : "Acesse sua conta MedicTech"}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="pl-9 rounded-xl h-11 bg-background/50" placeholder="Seu nome" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 rounded-xl h-11 bg-background/50" placeholder="voce@email.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 rounded-xl h-11 bg-background/50" placeholder="Mínimo 6 caracteres" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl h-12 bg-gradient-hero hover:opacity-90 shadow-glow border-0 text-base">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "signup" ? "Criar conta" : "Entrar")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="text-primary font-semibold hover:underline">
              {mode === "signup" ? "Entrar" : "Cadastre-se"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
