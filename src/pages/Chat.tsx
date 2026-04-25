import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Loader2, Sparkles, User, AlertCircle, ArrowLeft, Plus, Activity } from "lucide-react";
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
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* App-style header */}
      <header className="shrink-0 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto w-full">
          <button onClick={() => navigate("/dashboard")} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-background" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-sm">MedicTech AI</div>
              <div className="text-[11px] text-muted-foreground">Online · Triagem médica</div>
            </div>
          </div>
          <button onClick={() => setMessages([])} className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors" aria-label="Nova conversa">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10 animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center shadow-soft">
                <Activity className="w-8 h-8 text-primary-foreground" strokeWidth={2} />
              </div>
              <h2 className="font-serif text-2xl mb-2 text-foreground">Como posso ajudar hoje?</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm mx-auto">
                Descreva os seus sintomas e receba orientação inicial baseada em IA.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 max-w-xl mx-auto">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="bg-background border border-border rounded-xl p-3 text-left text-sm hover:border-primary hover:shadow-soft transition-all text-foreground/80"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary inline mr-1.5" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${m.role === "user" ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-background border border-border rounded-tl-sm"
              }`}>
                {m.content || <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 bg-background border-t border-border safe-bottom">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="max-w-4xl mx-auto px-3 py-3 flex items-end gap-2"
        >
          <div className="flex-1 bg-secondary rounded-2xl flex items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Descreva o sintoma..."
              className="flex-1 resize-none border-0 bg-transparent focus-visible:ring-0 min-h-[44px] max-h-32 text-sm"
              rows={1}
            />
          </div>
          <Button
            type="submit"
            disabled={streaming || !input.trim()}
            size="icon"
            className="rounded-full h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 border-0 shrink-0 shadow-soft"
          >
            {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground text-center pb-2 px-4 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" /> Ferramenta de triagem · não substitui avaliação médica.
        </p>
      </div>
    </div>
  );
};

export default Chat;