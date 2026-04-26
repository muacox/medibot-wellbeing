import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, Activity, Brain, Clock, History, Trash2, Stethoscope, MessageSquareText, Home, LogOut, FileText } from "lucide-react";
import { toast } from "sonner";

type Condition = { name: string; probability: "alta" | "média" | "baixa"; description: string };
type Result = { possible_conditions: Condition[]; recommendations: string[]; urgency: string; disclaimer: string };
type HistoryItem = { id: string; symptoms: string; created_at: string; possible_conditions: Condition[]; recommendations: string[] };

const probColor = (p: string) => p === "alta" ? "bg-destructive/15 text-destructive" : p === "média" ? "bg-warning/15 text-warning" : "bg-success/15 text-success";
const urgencyStyle = (u: string) => u === "emergência" ? "from-destructive to-destructive/70" : u === "consulta breve" ? "from-warning to-warning/70" : "from-success to-success/70";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);
  useEffect(() => { if (user) loadHistory(); }, [user]);

  const loadHistory = async () => {
    const { data } = await supabase.from("symptom_analyses").select("*").order("created_at", { ascending: false }).limit(10);
    if (data) setHistory(data as any);
  };

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return toast.error("Descreva seus sintomas");
    setAnalyzing(true); setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptoms", {
        body: { symptoms, age: age ? Number(age) : null, gender, duration, severity },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
      await supabase.from("symptom_analyses").insert({
        user_id: user!.id, symptoms, age: age ? Number(age) : null, gender, duration, severity,
        possible_conditions: data.possible_conditions, recommendations: data.recommendations,
      });
      loadHistory();
      toast.success("Análise concluída");
    } catch (err: any) {
      toast.error(err.message || "Erro na análise");
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteHistory = async (id: string) => {
    await supabase.from("symptom_analyses").delete().eq("id", id);
    loadHistory();
    toast.success("Removido");
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-secondary/30 relative overflow-hidden">
      <Navbar />
      <div className="absolute top-20 -right-32 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <main className="relative pt-28 pb-16 px-4 max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-up flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl mb-2">Olá <span className="text-primary">{user?.email?.split("@")[0]}</span></h1>
            <p className="text-muted-foreground">Descreva seus sintomas para receber uma análise prévia.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/")} variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary uppercase text-xs tracking-wider">
              <Home className="w-4 h-4 mr-1.5" /> Início
            </Button>
            <Button onClick={() => navigate("/chat")} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase text-xs tracking-wider shadow-soft">
              <MessageSquareText className="w-4 h-4 mr-1.5" /> Chat IA
            </Button>
            <Button onClick={async () => { await signOut(); navigate("/"); }} variant="outline" className="rounded-full liquid-glass-btn !text-primary border-0 uppercase text-xs tracking-wider">
              <LogOut className="w-4 h-4 mr-1.5" /> Sair
            </Button>
          </div>
        </div>

        {/* Atalhos rápidos */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8 animate-fade-up">
          {[
            { icon: MessageSquareText, t: "Chat IA", d: "Conversar com o assistente", to: "/chat" },
            { icon: History, t: "Histórico", d: `${history.length} análises`, to: "#historico" },
            { icon: FileText, t: "Nova análise", d: "Descrever sintomas agora", to: "#form" },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => a.to.startsWith("#") ? document.getElementById(a.to.slice(1))?.scrollIntoView({ behavior: "smooth" }) : navigate(a.to)}
              className="liquid-glass rounded-2xl p-4 flex items-center gap-3 text-left hover:-translate-y-0.5 hover:shadow-glow transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <a.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-medium">{a.t}</div>
                <div className="text-xs text-muted-foreground">{a.d}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form */}
          <form id="form" onSubmit={analyze} className="lg:col-span-3 liquid-glass rounded-2xl p-6 md:p-8 space-y-5 animate-fade-up">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center"><Stethoscope className="w-5 h-5 text-primary-foreground" /></div>
              <h2 className="font-semibold text-xl">Nova análise</h2>
            </div>

            <div className="space-y-1.5">
              <Label>Sintomas *</Label>
              <Textarea required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Ex: dor de cabeça forte há 2 dias, febre, calafrios e fadiga..." className="min-h-[120px] rounded-none bg-background/50 resize-none" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Idade</Label>
                <Input type="number" min="0" max="120" value={age} onChange={(e) => setAge(e.target.value)} className="rounded-none bg-background/50 h-11" placeholder="Ex: 32" />
              </div>
              <div className="space-y-1.5">
                <Label>Gênero</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="rounded-none bg-background/50 h-11"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Duração</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="rounded-none bg-background/50 h-11"><SelectValue placeholder="Há quanto tempo?" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos de 1 dia">Menos de 1 dia</SelectItem>
                    <SelectItem value="1-3 dias">1 a 3 dias</SelectItem>
                    <SelectItem value="4-7 dias">4 a 7 dias</SelectItem>
                    <SelectItem value="mais de 1 semana">Mais de 1 semana</SelectItem>
                    <SelectItem value="mais de 1 mês">Mais de 1 mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Severidade</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger className="rounded-none bg-background/50 h-11"><SelectValue placeholder="Intensidade" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="forte">Forte</SelectItem>
                    <SelectItem value="incapacitante">Incapacitante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={analyzing} className="w-full rounded-full h-12 bg-primary hover:opacity-90 border-0 text-base shadow-soft">
              {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando com IA...</> : <><Sparkles className="w-4 h-4 mr-2" /> Analisar sintomas</>}
            </Button>
          </form>

          {/* History */}
          <aside id="historico" className="lg:col-span-2 liquid-glass rounded-2xl p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">Histórico</h2>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Suas análises aparecerão aqui.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {history.map((h) => (
                  <div key={h.id} className="bg-background/60 backdrop-blur border border-white/40 rounded-xl p-3 group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{h.symptoms}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(h.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <button onClick={() => deleteHistory(h.id)} className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* Result */}
        {result && (
          <section className="mt-8 space-y-6 animate-fade-up">
            <div className="liquid-glass rounded-2xl p-6 border-l-4 !border-l-primary">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${urgencyStyle(result.urgency)} flex items-center justify-center shadow-soft shrink-0`}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Nível de atenção</p>
                  <h3 className="font-semibold text-xl capitalize">{result.urgency}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{result.disclaimer}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="liquid-glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Possíveis condições</h3>
                </div>
                <div className="space-y-3">
                  {result.possible_conditions.map((c, i) => (
                    <div key={i} className="bg-background/60 backdrop-blur border border-white/40 rounded-xl p-4">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <h4 className="font-semibold">{c.name}</h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${probColor(c.probability)}`}>{c.probability}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="liquid-glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Recomendações</h3>
                </div>
                <ul className="space-y-3">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
