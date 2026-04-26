import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, User, AlertCircle, ArrowLeft, Plus, Check, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import iconGeminiFlash from "@/assets/ai-gemini-flash.png";
import iconGeminiPro from "@/assets/ai-gemini-pro.png";
import iconGptMini from "@/assets/ai-gpt-mini.png";
import iconGpt5 from "@/assets/ai-gpt-5.png";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Estou com dor de cabeça e febre baixa há 3 dias",
  "Tenho tosse seca persistente, o que pode ser?",
  "Sinto dor abdominal no lado direito após comer",
  "Como posso aliviar uma enxaqueca em casa?",
];

const MODELS = [
  { id: "google/gemini-3-flash-preview", name: "Gemini Flash", img: iconGeminiFlash, tag: "Rápido" },
  { id: "google/gemini-2.5-pro", name: "Gemini Pro", img: iconGeminiPro, tag: "Avançado" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini", img: iconGptMini, tag: "Eficiente" },
  { id: "openai/gpt-5", name: "GPT-5", img: iconGpt5, tag: "Premium" },
];

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState(MODELS[0].id);
  const [modelOpen, setModelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!loading && !user) navigate("/auth"); }, [user, loading, navigate]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medic-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, model }),
      });

      if (resp.status === 429) { toast.error("Muitas requisições. Aguarde."); setStreaming(false); return; }
      if (resp.status === 402) { toast.error("Créditos esgotados."); setStreaming(false); return; }
      if (!resp.ok || !resp.body) { toast.error("Erro ao conectar."); setStreaming(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let done = false;

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setStreaming(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  const currentModel = MODELS.find((m) => m.id === model) ?? MODELS[0];

  return (
    <div className="h-[100dvh] flex flex-col bg-gradient-to-b from-secondary/40 via-background to-secondary/30">
      {/* Header app */}
      <header className="shrink-0 bg-primary text-primary-foreground shadow-soft relative z-20">
        <div className="container-x flex items-center justify-between h-16">
          <button onClick={() => navigate("/dashboard")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-background/15 transition-colors" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setModelOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full bg-background/15 hover:bg-background/25 transition-colors"
          >
            <img src={currentModel.img} alt={currentModel.name} className="w-7 h-7 rounded-full bg-background/90 p-0.5" loading="lazy" width={28} height={28} />
            <div className="leading-tight text-left">
              <div className="text-xs font-semibold tracking-wide">{currentModel.name}</div>
              <div className="text-[9px] text-primary-foreground/80 uppercase tracking-[0.15em]">{currentModel.tag} · Online</div>
            </div>
          </button>
          <button onClick={() => setMessages([])} className="text-xs uppercase tracking-wider hover:bg-background/15 rounded-full px-3 py-1.5 transition-colors" aria-label="Nova conversa">
            Nova
          </button>
        </div>

        {/* Dropdown de modelos */}
        {modelOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setModelOpen(false)} />
            <div className="container-x relative z-20">
              <div className="liquid-glass rounded-2xl mt-2 p-2 animate-fade-up !text-foreground shadow-glow">
                <div className="px-2 pt-1 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Escolha o modelo</div>
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setModel(m.id); setModelOpen(false); toast.success(`Modelo: ${m.name}`); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-left ${
                    model === m.id ? "bg-primary/10" : ""
                  }`}
                >
                    <img src={m.img} alt={m.name} className="w-9 h-9 rounded-full bg-background shadow-soft" loading="lazy" width={36} height={36} />
                  <div className="flex-1 leading-tight">
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.tag}</div>
                  </div>
                  {model === m.id && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
          </>
        )}
      </header>

      {/* Mensagens */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="container-x max-w-3xl py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10 animate-fade-up max-w-xl mx-auto">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-soft" />
                <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-glow">
                  <Stethoscope className="w-9 h-9 text-primary-foreground" strokeWidth={1.8} />
                </div>
              </div>
              <p className="uppercase tracking-[0.3em] text-[10px] mb-2 text-primary font-medium">Assistente Médico</p>
              <h2 className="font-serif text-3xl mb-3">Como posso ajudar hoje?</h2>
              <p className="text-muted-foreground text-sm mb-2 max-w-md mx-auto">
                Descreva os seus sintomas. Esta avaliação não substitui consulta médica.
              </p>
              <p className="text-xs text-muted-foreground/80 mb-8 italic">
                Apenas tópicos de saúde e medicina.
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className="liquid-glass rounded-xl p-3.5 text-left text-sm hover:-translate-y-0.5 hover:shadow-glow transition-all animate-fade-up"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "user" ? (
                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center mt-0.5 bg-foreground text-background shadow-soft">
                  <User className="w-4 h-4" />
                </div>
              ) : (
                <img src={currentModel.img} alt={currentModel.name} className="w-9 h-9 rounded-full shrink-0 mt-0.5 bg-background shadow-soft" loading="lazy" width={36} height={36} />
              )}
              <div className={`px-4 py-3 max-w-[82%] text-sm leading-relaxed whitespace-pre-wrap shadow-soft ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                  : "liquid-glass rounded-2xl rounded-tl-sm"
              }`}>
                {m.content || (
                  <span className="inline-flex items-center gap-1 py-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-soft" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 liquid-glass !rounded-none border-t border-white/40">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="container-x max-w-3xl py-3 flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Descreva o sintoma ou faça uma pergunta médica..."
            className="flex-1 resize-none bg-background/70 border border-white/40 focus-visible:ring-1 focus-visible:ring-primary min-h-[46px] max-h-32 text-sm rounded-2xl px-4 py-3"
            rows={1}
          />
          <Button
            type="submit"
            disabled={streaming || !input.trim()}
            size="icon"
            className="rounded-full h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 shadow-soft hover:scale-105 transition-transform"
          >
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground text-center pb-2 px-4 flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3 h-3" /> Apenas saúde e medicina · não substitui avaliação médica.
        </p>
      </div>
    </div>
  );
};

export default Chat;