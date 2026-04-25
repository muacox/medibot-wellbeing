import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Activity, ArrowLeft, Stethoscope, ShieldCheck, HeartPulse } from "lucide-react";
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
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left — brand panel (institutional) */}
      <aside className="md:w-1/2 lg:w-[55%] bg-foreground text-background relative overflow-hidden flex flex-col justify-between p-6 md:p-12 min-h-[200px] md:min-h-screen">
        <div className="absolute -top-32 -right-20 w-[420px] h-[420px] bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-[380px] h-[380px] bg-primary/20 rounded-full blur-3xl" />

        <Link to="/" className="relative inline-flex items-center gap-2 text-background hover:text-primary transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar ao início</span>
        </Link>

        <div className="relative hidden md:block max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-2xl text-background">Medic<span className="text-primary">Tech</span></span>
          </div>

          <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-4">
            Saúde inteligente,<br />ao seu alcance.
          </h2>
          <p className="text-background/70 leading-relaxed mb-10">
            Triagem médica baseada em inteligência artificial. Confidencial, rápida e segura.
          </p>

          <div className="space-y-4">
            {[
              { icon: Stethoscope, t: "Análise de sintomas em segundos" },
              { icon: ShieldCheck, t: "Os seus dados estão protegidos" },
              { icon: HeartPulse, t: "Recomendações práticas e claras" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-background/85">
                <div className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{item.t}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-background/50 hidden md:block">
          © {new Date().getFullYear()} MedicTech · Todos os direitos reservados
        </p>
      </aside>

      {/* Right — form */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl">Medic<span className="text-primary">Tech</span></span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl mb-2 text-foreground">
            {mode === "signup" ? "Criar conta" : "Iniciar sessão"}
          </h1>
          <p className="text-muted-foreground mb-8 text-sm">
            {mode === "signup"
              ? "Preencha os seus dados para começar."
              : "Bem-vindo de volta. Aceda à sua conta."}
          </p>

          <form onSubmit={submit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nome completo</Label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12 rounded-lg" placeholder="O seu nome" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">E-mail</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 rounded-lg" placeholder="exemplo@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Palavra-passe</Label>
                {mode === "login" && (
                  <button type="button" className="text-xs text-muted-foreground hover:text-primary">Esqueceu?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 rounded-lg" placeholder="Mínimo 6 caracteres" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base shadow-soft border-0 rounded-lg">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "signup" ? "Criar conta" : "Entrar")}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="text-primary font-semibold hover:underline">
              {mode === "signup" ? "Iniciar sessão" : "Registar-se"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
