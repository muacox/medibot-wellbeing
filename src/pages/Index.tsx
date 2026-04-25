import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Stethoscope, Heart, Baby, Brain, Eye, Bone, Activity, Pill,
  Phone, Mail, MapPin, Clock, ChevronRight, Plus, Facebook, Instagram, Linkedin,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-16 bg-primary text-primary-foreground">
        <div className="container-x py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-up">
            <p className="uppercase tracking-[0.25em] text-xs mb-4 text-primary-foreground/80">Bem-vindo</p>
            <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
              Cuidamos de si com<br />
              <span className="italic">dedicação e ciência.</span>
            </h1>
            <p className="text-primary-foreground/85 max-w-lg mb-8 leading-relaxed">
              MedicTech é um serviço de triagem médica que combina o rigor clínico ao acesso digital.
              Faça a marcação da sua consulta de forma simples.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
                className="rounded-none bg-background text-primary hover:bg-background/90 uppercase tracking-wider text-xs h-12 px-8"
              >
                Marcar Consulta
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate(user ? "/chat" : "/auth")}
                className="rounded-none border-background text-background hover:bg-background hover:text-primary uppercase tracking-wider text-xs h-12 px-8"
              >
                Saber Mais
              </Button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full border-2 border-background/30 flex items-center justify-center relative">
              <div className="absolute inset-6 rounded-full border border-background/20" />
              <Plus className="w-32 h-32 text-background/90" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUIÇÃO */}
      <section id="instituicao" className="py-20 md:py-28 bg-background">
        <div className="container-x grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">A Instituição</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
              Compromisso com a sua saúde
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Reafirmamos o compromisso com a literacia em saúde e o acompanhamento multidisciplinar
              de cada utente. A nossa equipa está dedicada a oferecer um serviço próximo, atento e
              de qualidade.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Trabalhamos com tecnologia para tornar o acesso à informação clínica mais simples,
              sem nunca substituir a relação médico-utente.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              Saiba mais <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border border border-border">
            {[
              { n: "35", l: "Anos de experiência" },
              { n: "120+", l: "Profissionais" },
              { n: "20", l: "Especialidades" },
              { n: "24/7", l: "Atendimento" },
            ].map((s) => (
              <div key={s.l} className="bg-background p-8 text-center">
                <div className="font-serif text-4xl md:text-5xl text-primary mb-2">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-20 md:py-28 bg-secondary">
        <div className="container-x">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">Serviços</p>
            <h2 className="font-serif text-3xl md:text-5xl mb-4">O que oferecemos</h2>
            <p className="text-muted-foreground">Soluções pensadas para cada etapa do cuidado.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {[
              { icon: Stethoscope, t: "Consultas", d: "Marcação e acompanhamento clínico." },
              { icon: Activity, t: "Exames", d: "Diagnósticos rigorosos e detalhados." },
              { icon: Pill, t: "Tratamentos", d: "Acompanhamento personalizado." },
              { icon: Heart, t: "Urgências", d: "Atendimento disponível 24/7." },
              { icon: Baby, t: "Pediatria", d: "Cuidado dedicado aos mais novos." },
              { icon: Brain, t: "Triagem IA", d: "Avaliação inicial dos sintomas." },
            ].map((s, i) => (
              <div key={i} className="bg-background p-8 group hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                <s.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground mb-5" strokeWidth={1.5} />
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
          <div className="text-center mb-14">
            <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary">Especialidades</p>
            <h2 className="font-serif text-3xl md:text-5xl">Cuidamos de si por inteiro</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Heart, t: "Cardiologia" },
              { icon: Brain, t: "Neurologia" },
              { icon: Baby, t: "Pediatria" },
              { icon: Eye, t: "Oftalmologia" },
              { icon: Bone, t: "Ortopedia" },
              { icon: Stethoscope, t: "Clínica Geral" },
              { icon: Activity, t: "Cardiologia" },
              { icon: Pill, t: "Farmácia" },
            ].map((e, i) => (
              <div key={i} className="border border-border p-5 text-center hover:border-primary hover:shadow-soft transition-all">
                <e.icon className="w-7 h-7 text-primary mx-auto mb-3" strokeWidth={1.5} />
                <div className="text-sm font-medium">{e.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="blog" className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container-x text-center max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.25em] text-xs mb-3 text-primary-foreground/80">Comece agora</p>
          <h2 className="font-serif text-3xl md:text-5xl mb-6">Pronto para cuidar de si?</h2>
          <p className="text-primary-foreground/85 mb-8">
            Crie a sua conta gratuita e marque a sua primeira consulta hoje.
          </p>
          <Button
            size="lg"
            onClick={() => navigate(user ? "/dashboard" : "/auth?mode=signup")}
            className="rounded-none bg-background text-primary hover:bg-background/90 uppercase tracking-wider text-xs h-12 px-10"
          >
            Criar Conta
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
                <a key={i} href="#" className="w-10 h-10 border border-background/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors" aria-label="Rede social">
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
              <a href="#" className="hover:text-primary">Política de Privacidade</a>
              <a href="#" className="hover:text-primary">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { Logo } from "@/components/Logo";
export default Index;