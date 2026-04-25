import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, User, AlertCircle, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Estou com dor de cabeça e febre baixa há 3 dias",
  "Tenho tosse seca persistente, o que pode ser?",
  "Sinto dor abdominal no lado direito após comer",
  "Como posso aliviar uma enxaqueca em casa?",
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

  return (
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Header app */}
      <header className="shrink-0 bg-primary text-primary-foreground border-b border-primary/30">
        <div className="container-x flex items-center justify-between h-14">
          <button onClick={() => navigate("/dashboard")} className="w-9 h-9 flex items-center justify-center hover:bg-background/10" aria-label="Voltar">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-sm uppercase tracking-wider">MedicTech</div>
              <div className="text-[10px] text-primary-foreground/70 uppercase tracking-wider">Assistente · Online</div>
            </div>
          </div>
          <button onClick={() => setMessages([])} className="text-xs uppercase tracking-wider hover:underline" aria-label="Nova conversa">
            Nova
          </button>
        </div>
      </header>

      {/* Mensagens */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-secondary/40">
        <div className="container-x py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-10 animate-fade-up max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full border-2 border-primary mx-auto mb-5 flex items-center justify-center">
                <Plus className="w-7 h-7 text-primary" strokeWidth={2} />
              </div>
              <p className="uppercase tracking-[0.25em] text-xs mb-2 text-primary">Triagem</p>
              <h2 className="font-serif text-2xl mb-3">Como posso ajudar hoje?</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Descreva os seus sintomas. Esta avaliação não substitui consulta médica.
              </p>
              <div className="grid sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => send(s)}
                    className="bg-background border border-border p-3 text-left text-sm hover:border-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 animate-fade-up ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${m.role === "user" ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}>
                {m.role === "user" ? <User className="w-4 h-4" /> : <Plus className="w-4 h-4" strokeWidth={2.5} />}
              </div>
              <div className={`px-4 py-2.5 max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border border-border"
              }`}>
                {m.content || <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 bg-background border-t border-border">
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="container-x py-3 flex items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Descreva o sintoma..."
            className="flex-1 resize-none bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary min-h-[44px] max-h-32 text-sm rounded-none"
            rows={1}
          />
          <Button
            type="submit"
            disabled={streaming || !input.trim()}
            size="icon"
            className="rounded-none h-11 w-11 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
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