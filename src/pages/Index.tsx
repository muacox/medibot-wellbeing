import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Stethoscope, Brain, ShieldCheck, Sparkles, Activity, HeartPulse, Pill, ArrowRight, Bot, Lock, Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      <main className="relative">
        {/* HERO — institucional */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">
          {/* subtle background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-primary/15 blur-3xl rounded-full animate-float" />
          <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] bg-primary-glow/10 blur-3xl rounded-full animate-float" style={{ animationDelay: "3s" }} />

          <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="w-12 h-1 bg-primary mb-6" />
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6 text-foreground">
                MedicTech
                <br />
                <span className="text-primary">Saúde inteligente</span>
                <br />
                ao seu alcance
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                Plataforma de triagem médica que utiliza inteligência artificial para analisar
                sintomas, sugerir possíveis condições e oferecer recomendações iniciais — sempre
                com o rigor de orientar quando procurar um profissional de saúde.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 px-7 shadow-soft border-0 group"
                >
                  {user ? "Ir ao Painel" : "Iniciar Sessão"}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(user ? "/chat" : "/auth?mode=signup")}
                  className="h-12 px-7 border-foreground/20 hover:bg-foreground hover:text-background transition-all"
                >
                  Registar-se
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="aspect-square max-w-md mx-auto relative">
                <div className="absolute inset-0 bg-gradient-hero rounded-[2rem] rotate-6 opacity-30" />
                <div className="absolute inset-0 glass-strong rounded-[2rem] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                  <Stethoscope className="w-48 h-48 text-primary relative" strokeWidth={1.2} />
                  <div className="absolute top-6 right-6 glass rounded-2xl p-3 animate-float">
                    <HeartPulse className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="absolute bottom-6 left-6 glass rounded-2xl p-3 animate-float" style={{ animationDelay: "1.5s" }}>
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute top-1/2 left-4 glass rounded-2xl p-3 animate-float" style={{ animationDelay: "2.5s" }}>
                    <Pill className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sobre Nós */}
        <section id="sobre" className="px-4 py-24 bg-secondary/40">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-primary font-semibold tracking-wider text-sm uppercase">Sobre Nós</span>
                <div className="h-px w-16 bg-primary" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
                Na vanguarda da tecnologia em saúde
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                MedicTech é uma plataforma desenvolvida para apoiar pessoas em momentos de
                incerteza sobre a sua saúde. Combinamos inteligência artificial avançada com
                conhecimento clínico estruturado para oferecer triagem inicial de qualidade.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Pautamo-nos pelo rigor, pela ética e pelo cumprimento escrupuloso da
                confidencialidade dos dados — princípios fundamentais para um serviço de saúde
                digital responsável.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: "10K+", l: "Análises" },
                  { n: "98%", l: "Precisão" },
                  { n: "24/7", l: "Disponível" },
                ].map((s) => (
                  <div key={s.l} className="border-l-2 border-primary pl-3">
                    <div className="font-serif text-2xl md:text-3xl font-semibold text-foreground">{s.n}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Brain, t: "IA Médica", d: "Modelo treinado em padrões clínicos." },
                { icon: ShieldCheck, t: "Segurança", d: "Dados criptografados e protegidos." },
                { icon: Stethoscope, t: "Triagem", d: "Avaliação contextual de sintomas." },
                { icon: HeartPulse, t: "Cuidado", d: "Orientação para próximos passos." },
              ].map((c, i) => (
                <div key={i} className="bg-background border border-border p-6 rounded-2xl hover:border-primary hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
                  <c.icon className="w-8 h-8 text-primary mb-3" strokeWidth={1.6} />
                  <h3 className="font-semibold mb-1">{c.t}</h3>
                  <p className="text-sm text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="actualidade" className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">Os nossos serviços</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3">O que fazemos por si</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "IA médica avançada", desc: "Modelo treinado para identificar padrões em milhares de condições clínicas." },
            { icon: Stethoscope, title: "Análise contextual", desc: "Considera idade, gênero, duração e severidade para resultados precisos." },
            { icon: HeartPulse, title: "Recomendações reais", desc: "Cuidados em casa, sinais de alerta e orientação sobre quando buscar atendimento." },
          ].map((f, i) => (
            <div key={i} className="bg-background border border-border rounded-2xl p-7 hover:shadow-glow hover:border-primary transition-all duration-500 animate-fade-up group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-5 shadow-soft group-hover:rotate-6 transition-transform">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
          </div>
        </section>

        {/* Steps */}
        <section id="eventos" className="max-w-5xl mx-auto px-4 py-24 bg-secondary/40 rounded-none -mx-4 md:mx-auto md:rounded-2xl my-12">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold tracking-wider text-sm uppercase">Como funciona</span>
            <h2 className="font-serif text-3xl md:text-5xl mt-3 mb-4">Três passos simples</h2>
            <p className="text-muted-foreground text-lg">Do cadastro à análise em menos de um minuto.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 px-4">
            {[
              { n: "01", icon: Activity, t: "Cadastre-se", d: "Crie sua conta gratuita e segura." },
              { n: "02", icon: Pill, t: "Descreva sintomas", d: "Conte o que está sentindo, com detalhes." },
              { n: "03", icon: Sparkles, t: "Receba análise", d: "Possíveis condições e recomendações da IA." },
            ].map((s, i) => (
              <div key={i} className="relative bg-background border border-border rounded-2xl p-7 hover:shadow-soft transition-all">
                <span className="font-serif text-6xl text-primary/20 absolute top-3 right-5">{s.n}</span>
                <s.icon className="w-7 h-7 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-1">{s.t}</h3>
                <p className="text-muted-foreground text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="contacto" className="max-w-5xl mx-auto px-4 py-24">
          <div className="relative rounded-2xl overflow-hidden bg-foreground p-10 md:p-14 text-center text-background shadow-glow">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
            <h2 className="font-serif text-3xl md:text-5xl mb-4 relative">Pronto para começar?</h2>
            <p className="text-background/80 text-lg mb-8 relative max-w-xl mx-auto">Cadastre-se grátis e tenha a sua primeira análise agora.</p>
            <Button
              size="lg"
              onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-semibold shadow-xl border-0 relative"
            >
              Criar conta grátis <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer institucional */}
      <footer className="bg-foreground text-background mt-12">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg">Medic<span className="text-primary">Tech</span></span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed">
              Plataforma de triagem médica inteligente, ao serviço da sua saúde.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary">Navegação</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre Nós</a></li>
              <li><a href="#actualidade" className="hover:text-primary transition-colors">Serviços</a></li>
              <li><a href="#eventos" className="hover:text-primary transition-colors">Como Funciona</a></li>
              <li><a href="#contacto" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary">Contacto</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> contacto@medictech.ao</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +244 900 000 000</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5" /> Luanda, Angola</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary">Siga-nos</h4>
            <div className="flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all hover:-translate-y-1">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-background/50 mt-4">
              <Lock className="w-3 h-3 inline mr-1" /> Os seus dados estão protegidos.
            </p>
          </div>
        </div>

        <div className="border-t border-background/10">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/60">
            <p>© {new Date().getFullYear()} MedicTech. Todos os direitos reservados.</p>
            <p className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">Política de Privacidade</a>
              <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
