import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Loader2, Sparkles, User, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Estou com dor de cabeça há 3 dias e febre baixa",
  "Tosse seca persistente, o que pode ser?",
  "Dor abdominal no lado direito após comer",
  "Como aliviar enxaqueca em casa?",
];

const Chat = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
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
        body: JSON.stringify({ messages: next }),
      });

      if (resp.status === 429) { toast.error("Muitas requisições. Tente em instantes."); setStreaming(false); return; }
      if (resp.status === 402) { toast.error("Créditos de IA esgotados."); setStreaming(false); return; }
      if (!resp.ok || !resp.body) { toast.error("Erro ao conectar com a IA"); setStreaming(false); return; }

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
    } catch (e: any) {
      toast.error(e.message || "Erro");
    } finally {
      setStreaming(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden">
      <Navbar />
      <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-primary/20 animate-blob" />
      <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-accent/20 animate-blob" style={{ animationDelay: "6s" }} />

      <main className="relative pt-24 pb-32 px-4 max-w-3xl mx-auto h-screen flex flex-col">
        <div className="mb-4 animate-fade-up shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-2xl">MedicTech <span className="text-gradient italic">AI</span></h1>
              <p className="text-xs text-muted-foreground">Triagem conversacional · não substitui médico</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto glass-strong rounded-3xl p-4 md:p-6 space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-8 animate-fade-up">
              <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
              <h2 className="font-serif text-2xl mb-2">Como posso ajudar hoje?</h2>
              <p className="text-muted-foreground text-sm mb-6">Descreva sintomas ou faça uma pergunta sobre saúde.</p>
              <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => send(s)} className="glass rounded-2xl p-3 text-left text-sm hover:shadow-glow transition text-foreground/80">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${m.role === "user" ? "bg-foreground/10" : "bg-gradient-hero shadow-soft"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-gradient-hero text-primary-foreground" : "glass"}`}>
                {m.content || <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="glass-strong rounded-3xl p-2 flex items-end gap-2 shrink-0"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Descreva o sintoma..."
            className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 min-h-[44px] max-h-32"
            rows={1}
          />
          <Button type="submit" disabled={streaming || !input.trim()} size="icon" className="rounded-2xl h-11 w-11 bg-gradient-hero hover:opacity-90 shadow-glow border-0 shrink-0">
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>

        <p className="text-[11px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1.5">
          <AlertCircle className="w-3 h-3" /> O MedicTech AI é uma ferramenta de triagem e não substitui avaliação médica.
        </p>
      </main>
    </div>
  );
};

export default Chat;