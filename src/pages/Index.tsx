import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Stethoscope, Brain, ShieldCheck, Sparkles, Activity, HeartPulse, Pill, ArrowRight, Bot, Lock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen mesh-bg overflow-hidden">
      <Navbar />

      {/* Liquid blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[420px] h-[420px] bg-primary/30 animate-blob" />
        <div className="absolute top-40 -right-32 w-[480px] h-[480px] bg-accent/25 animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] bg-primary-glow/20 animate-blob" style={{ animationDelay: "8s" }} />
      </div>

      <main className="relative pt-32 pb-20 px-4">
        {/* Hero */}
        <section className="max-w-5xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Análise prévia com IA real</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
            Entenda seus sintomas <br />
            <span className="text-gradient italic">antes da consulta</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            MedicTech analisa seus sintomas com inteligência artificial e sugere possíveis condições e recomendações personalizadas — em segundos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
              className="rounded-full bg-gradient-hero hover:opacity-90 shadow-glow border-0 text-base h-14 px-8 group"
            >
              {user ? "Ir ao painel" : "Analisar meus sintomas"}
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 glass border-0">
              <Bot className="w-5 h-5 mr-2" /> Como funciona
            </Button>
          </div>

          {/* trust */}
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Dados criptografados</div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Resposta em segundos</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Não substitui médico</div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto mt-32 grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "IA médica avançada", desc: "Modelo treinado para identificar padrões em milhares de condições clínicas." },
            { icon: Stethoscope, title: "Análise contextual", desc: "Considera idade, gênero, duração e severidade para resultados precisos." },
            { icon: HeartPulse, title: "Recomendações reais", desc: "Cuidados em casa, sinais de alerta e orientação sobre quando buscar atendimento." },
          ].map((f, i) => (
            <div key={i} className="glass rounded-3xl p-7 hover:shadow-glow transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center mb-5 shadow-soft">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Steps */}
        <section className="max-w-5xl mx-auto mt-32">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl mb-4">Três passos simples</h2>
            <p className="text-muted-foreground text-lg">Do cadastro à análise em menos de um minuto.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "01", icon: Activity, t: "Cadastre-se", d: "Crie sua conta gratuita e segura." },
              { n: "02", icon: Pill, t: "Descreva sintomas", d: "Conte o que está sentindo, com detalhes." },
              { n: "03", icon: Sparkles, t: "Receba análise", d: "Possíveis condições e recomendações da IA." },
            ].map((s, i) => (
              <div key={i} className="relative glass rounded-3xl p-7">
                <span className="font-serif text-6xl text-primary/20 absolute top-3 right-5">{s.n}</span>
                <s.icon className="w-7 h-7 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-1">{s.t}</h3>
                <p className="text-muted-foreground text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto mt-32">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-hero p-10 md:p-14 text-center text-primary-foreground shadow-glow">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
            <h2 className="font-serif text-4xl md:text-5xl mb-4 relative">Pronto para começar?</h2>
            <p className="text-primary-foreground/90 text-lg mb-8 relative">Cadastre-se grátis e tenha sua primeira análise agora.</p>
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
              className="rounded-full bg-white text-primary hover:bg-white/90 h-14 px-8 text-base shadow-xl border-0 relative"
            >
              Criar conta grátis <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>

        <footer className="max-w-5xl mx-auto mt-20 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MedicTech. Esta ferramenta não substitui consulta médica profissional.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
