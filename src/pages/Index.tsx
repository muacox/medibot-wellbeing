import { Navbar } from "@/components/Navbar";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Stethoscope, Heart, Baby, Brain, Eye, Bone, Activity, Pill,
  Phone, Mail, MapPin, Clock, ChevronRight, Plus, Facebook, Instagram, Linkedin,
  Sparkles, MessageSquareText, FileText, ShieldCheck, Bot, ScanLine,
  ClipboardList, HeartPulse, AlertTriangle,
} from "lucide-react";
import iconGeminiFlash from "@/assets/ai-gemini-flash.png";
import iconGeminiPro from "@/assets/ai-gemini-pro.png";
import iconGptMini from "@/assets/ai-gpt-mini.png";
import iconGpt5 from "@/assets/ai-gpt-5.png";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const aiTools = [
    { icon: Bot, t: "Chat Médico IA", d: "Converse em tempo real com o assistente sobre sintomas e dúvidas.", to: user ? "/chat" : "/auth", cta: "Iniciar conversa" },
    { icon: ScanLine, t: "Análise de Sintomas", d: "Descreva sintomas e receba possíveis condições com nível de probabilidade.", to: user ? "/dashboard" : "/auth", cta: "Analisar agora" },
    { icon: ClipboardList, t: "Histórico Clínico", d: "Acompanhe todas as suas análises anteriores num só lugar.", to: user ? "/dashboard" : "/auth", cta: "Ver histórico" },
    { icon: AlertTriangle, t: "Alertas de Urgência", d: "A IA identifica sinais de emergência e orienta de imediato.", to: user ? "/chat" : "/auth", cta: "Saber mais" },
    { icon: FileText, t: "Recomendações", d: "Sugestões práticas de cuidados em casa baseadas nos seus sintomas.", to: user ? "/dashboard" : "/auth", cta: "Experimentar" },
    { icon: Sparkles, t: "Triagem Inteligente", d: "Avaliação rápida com base em idade, duração e severidade dos sintomas.", to: user ? "/dashboard" : "/auth", cta: "Começar triagem" },
  ];

  const valores = [
    { icon: ShieldCheck, l: "Privacidade", d: "Os seus dados estão seguros" },
    { icon: Sparkles, l: "IA Médica", d: "Triagem inteligente" },
    { icon: Clock, l: "24 / 7", d: "Sempre disponível" },
    { icon: HeartPulse, l: "Cuidado", d: "Atenção integral" },
  ];

  const servicos = [
    { icon: Stethoscope, t: "Consultas", d: "Marcação e acompanhamento clínico." },
    { icon: Activity, t: "Exames", d: "Diagnósticos rigorosos e detalhados." },
    { icon: Pill, t: "Tratamentos", d: "Acompanhamento personalizado." },
    { icon: Heart, t: "Urgências", d: "Atendimento disponível 24/7." },
    { icon: Baby, t: "Pediatria", d: "Cuidado dedicado aos mais novos." },
    { icon: Brain, t: "Triagem IA", d: "Avaliação inicial dos sintomas." },
  ];

  const especialidades = [
    { icon: Heart, t: "Cardiologia" },
    { icon: Brain, t: "Neurologia" },
    { icon: Baby, t: "Pediatria" },
    { icon: Eye, t: "Oftalmologia" },
    { icon: Bone, t: "Ortopedia" },
    { icon: Stethoscope, t: "Clínica Geral" },
    { icon: Activity, t: "Fisioterapia" },
    { icon: Pill, t: "Farmácia" },
  ];

  const aiModels = [
    { img: iconGeminiFlash, name: "Gemini Flash", tag: "Rápido", d: "Equilíbrio entre velocidade e qualidade. Ideal para triagem geral." },
    { img: iconGeminiPro, name: "Gemini Pro", tag: "Avançado", d: "Raciocínio profundo para análises clínicas complexas." },
    { img: iconGptMini, name: "GPT-5 Mini", tag: "Eficiente", d: "Respostas rápidas e precisas para perguntas diretas." },
    { img: iconGpt5, name: "GPT-5", tag: "Premium", d: "Modelo mais poderoso, com nuance médica e contexto longo." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-16 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full border border-background/10 animate-pulse-soft pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full border border-background/5 pointer-events-none" />
        <div className="container-x py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center relative">
          <div className="animate-fade-up">
            <p className="uppercase tracking-[0.25em] text-xs mb-4 text-primary-foreground/80">Bem-vindo</p>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
              Cuidamos de si com<br />
              <span className="italic">dedicação e ciência.</span>
            </h1>
            <p className="text-primary-foreground/85 max-w-lg mb-8 leading-relaxed">
              MedicTech é um serviço de triagem médica que combina o rigor clínico ao acesso digital.
              Avalie sintomas, fale com o assistente e marque a sua consulta.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
                className="rounded-none bg-background text-primary hover:bg-background/90 uppercase tracking-wider text-xs h-12 px-8 transition-transform hover:scale-105"
              >
                {user ? "Ir para o Painel" : "Marcar Consulta"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(user ? "/chat" : "/auth")}
                className="rounded-none border-background text-background hover:bg-background hover:text-primary uppercase tracking-wider text-xs h-12 px-8 transition-all"
              >
                <MessageSquareText className="w-4 h-4 mr-2" /> Falar com o Assistente
              </Button>
            </div>
          </div>

          <div className="hidden md:flex justify-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full border-2 border-background/30 flex items-center justify-center relative animate-float">
              <div className="absolute inset-6 rounded-full border border-background/20" />
              <div className="absolute inset-12 rounded-full border border-background/10" />
              <Plus className="w-32 h-32 text-background/90" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUIÇÃO */}
      <section id="instituicao" className="py-20 md:py-28 bg-background">
        <div className="container-x">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">A Instituição</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
              Compromisso com a sua saúde
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Reafirmamos o compromisso com a literacia em saúde e o acompanhamento atento de cada utente.
              Trabalhamos com tecnologia para tornar o acesso à informação clínica mais simples, sem
              nunca substituir a relação médico-utente.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all mt-6"
            >
              Saiba mais <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mt-14">
            {valores.map((s, i) => (
              <div
                key={s.l}
                style={{ animationDelay: `${i * 100}ms` }}
                className="bg-background p-8 text-center animate-fade-up hover:bg-secondary transition-colors group"
              >
                <s.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div className="font-serif text-lg mb-1">{s.l}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FERRAMENTAS DE IA */}
      <section className="py-20 md:py-28 bg-secondary">
        <div className="container-x">
          <div className="text-center mb-14 max-w-2xl mx-auto animate-fade-up">
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">Inteligência Artificial</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-4">Ferramentas IA ao seu serviço</h2>
            <p className="text-muted-foreground">
              Várias funcionalidades inteligentes para o ajudar a compreender melhor a sua saúde.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiTools.map((f, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 80}ms` }}
                className="liquid-glass rounded-2xl p-6 group hover:shadow-glow hover:-translate-y-1 transition-all duration-300 animate-fade-up flex flex-col"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <f.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" strokeWidth={1.8} />
                </div>
                <h3 className="font-serif text-xl mb-2">{f.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{f.d}</p>
                <button
                  onClick={() => navigate(f.to)}
                  className="text-xs uppercase tracking-wider text-primary font-medium inline-flex items-center gap-1.5 hover:gap-2.5 transition-all w-fit"
                >
                  {f.cta} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 MODELOS DE IA */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-x">
          <div className="text-center mb-14 max-w-2xl mx-auto animate-fade-up">
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">Modelos disponíveis</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-4">4 Modelos de IA Médica</h2>
            <p className="text-muted-foreground">
              Escolha o modelo ideal no chat — do mais rápido ao mais preciso.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiModels.map((m, i) => (
              <div
                key={m.name}
                style={{ animationDelay: `${i * 100}ms` }}
                className="liquid-glass rounded-2xl p-6 group hover:-translate-y-1 hover:shadow-glow transition-all duration-300 animate-fade-up"
              >
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-14 h-14 rounded-full bg-background shadow-soft group-hover:scale-110 transition-transform"
                    loading="lazy"
                    width={56}
                    height={56}
                  />
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {m.tag}
                  </span>
                </div>
                <h3 className="font-serif text-lg mb-2">{m.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 animate-fade-up">
            <Button
              onClick={() => navigate(user ? "/chat" : "/auth")}
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-wider text-xs h-12 px-8 shadow-soft hover:scale-105 transition-transform"
            >
              <MessageSquareText className="w-4 h-4 mr-2" /> Experimentar no Chat
            </Button>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-20 md:py-28 bg-secondary">
        <div className="container-x">
          <div className="text-center mb-14 max-w-2xl mx-auto animate-fade-up">
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">Serviços</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-4">O que oferecemos</h2>
            <p className="text-muted-foreground">Soluções pensadas para cada etapa do cuidado.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {servicos.map((s, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 70}ms` }}
                className="bg-background p-8 group hover:bg-primary hover:text-primary-foreground transition-all duration-500 animate-fade-up"
              >
                <s.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground mb-5 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <h3 className="font-serif text-xl mb-2">{s.t}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section id="especialidades" className="py-20 md:py-28 bg-background">
        <div className="container-x">
          <div className="text-center mb-14 animate-fade-up">
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">Especialidades</p>
            <h2 className="font-serif text-3xl md:text-5xl">Cuidamos de si por inteiro</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {especialidades.map((e, i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 60}ms` }}
                className="border border-border bg-background p-5 text-center hover:border-primary hover:shadow-soft hover:-translate-y-1 transition-all animate-fade-up group"
              >
                <e.icon className="w-7 h-7 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div className="text-sm font-medium">{e.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="blog" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-background/10 animate-pulse-soft pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-background/10 animate-pulse-soft pointer-events-none" style={{ animationDelay: "1s" }} />
        <div className="container-x text-center max-w-2xl mx-auto relative animate-fade-up">
          <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary-foreground/80">Comece agora</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-6">Pronto para cuidar de si?</h2>
          <p className="text-primary-foreground/85 mb-8">
            Crie a sua conta gratuita e fale com o assistente médico hoje.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
            className="rounded-none bg-background text-primary hover:bg-background/90 uppercase tracking-wider text-xs h-12 px-10 transition-transform hover:scale-105"
          >
            {user ? "Ir para o Painel" : "Criar Conta Gratuita"}
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contacto" className="bg-foreground text-background">
        <div className="container-x py-16 grid md:grid-cols-4 gap-10">
          <div>
            <Logo inverted />
            <p className="text-background/60 text-sm mt-5 leading-relaxed">
              Plataforma de triagem médica institucional, ao serviço da sua saúde.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] mb-5 text-background/60">Navegação</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#instituicao" className="hover:text-primary transition-colors">A Instituição</a></li>
              <li><a href="#servicos" className="hover:text-primary transition-colors">Serviços</a></li>
              <li><a href="#especialidades" className="hover:text-primary transition-colors">Especialidades</a></li>
              <li><a href="#contacto" className="hover:text-primary transition-colors">Contactos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] mb-5 text-background/60">Contactos</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 text-primary mt-0.5 shrink-0" /> (+244) 923 000 000</li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" /> contacto@medictech.ao</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" /> Luanda, Angola</li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" /> 24 horas / 7 dias</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.25em] mb-5 text-background/60">Siga-nos</h4>
            <div className="flex gap-2">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 transition-all" aria-label="Rede social">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-background/10">
          <div className="container-x py-5 flex flex-col md:flex-row justify-between gap-3 text-xs text-background/50">
            <p>© {new Date().getFullYear()} MedicTech. Todos os direitos reservados.</p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
