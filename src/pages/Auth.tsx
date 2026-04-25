import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, Phone } from "lucide-react";
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
        toast.success("Conta criada com sucesso.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta.");
      }
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Painel institucional */}
      <aside className="md:w-1/2 bg-primary text-primary-foreground p-6 md:p-12 flex flex-col justify-between min-h-[180px] md:min-h-screen">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm w-fit">
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </Link>

        <div className="hidden md:block max-w-md">
          <div className="w-14 h-14 rounded-full border-2 border-background flex items-center justify-center mb-8">
            <Plus className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary-foreground/80">MedicTech</p>
          <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-5">
            Acesso à sua área pessoal de saúde.
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed mb-10">
            Marque consultas, consulte o seu histórico e fale com o nosso assistente.
          </p>
          <div className="border-t border-background/20 pt-6 text-sm">
            <p className="text-primary-foreground/70 mb-1">Central de atendimento</p>
            <p className="flex items-center gap-2 font-medium"><Phone className="w-4 h-4" /> (+244) 923 000 000</p>
          </div>
        </div>

        <p className="hidden md:block text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} MedicTech · Todos os direitos reservados
        </p>
      </aside>

      {/* Formulário */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" strokeWidth={2.5} />
            </div>
            <span className="font-serif uppercase tracking-wider">MedicTech</span>
          </div>

          <p className="uppercase tracking-[0.25em] text-xs text-primary mb-3">
            {mode === "signup" ? "Novo utente" : "Área pessoal"}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mb-8">
            {mode === "signup" ? "Criar conta" : "Iniciar sessão"}
          </h1>

          <form onSubmit={submit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Nome completo</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-none border-x-0 border-t-0 border-b-2 border-border focus-visible:border-primary focus-visible:ring-0 px-0" placeholder="Insira o seu nome" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-none border-x-0 border-t-0 border-b-2 border-border focus-visible:border-primary focus-visible:ring-0 px-0" placeholder="exemplo@email.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Palavra-passe</Label>
                {mode === "login" && <button type="button" className="text-xs text-muted-foreground hover:text-primary">Esqueceu?</button>}
              </div>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-none border-x-0 border-t-0 border-b-2 border-border focus-visible:border-primary focus-visible:ring-0 px-0" placeholder="Mínimo 6 caracteres" />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs mt-8">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === "signup" ? "Criar Conta" : "Entrar")}
            </Button>
          </form>

          <div className="mt-10 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="text-primary font-medium hover:underline ml-1">
              {mode === "signup" ? "Iniciar sessão" : "Registar-se"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;