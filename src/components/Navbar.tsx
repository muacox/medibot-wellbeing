import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, LogOut, MessageSquareText, Menu, X, Calendar, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (to: string) => { setOpen(false); navigate(to); };

  const links = [
    { to: "/#instituicao", label: "A Instituição" },
    { to: "/#servicos", label: "Serviços" },
    { to: "/#especialidades", label: "Especialidades" },
    { to: "/#blog", label: "Blog" },
    { to: "/#contacto", label: "Contactos" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "liquid-glass shadow-soft" : "bg-background/70 backdrop-blur-md border-b border-white/30"
      }`}>
        <div className="container-x flex items-center justify-between h-16">
          <Link to="/" className="hover:opacity-80 transition-opacity"><Logo /></Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex text-foreground hover:text-primary hover:bg-primary/10 rounded-full uppercase text-xs tracking-wider font-medium px-4"
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5" /> Painel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex text-foreground hover:text-primary hover:bg-primary/10 rounded-full uppercase text-xs tracking-wider font-medium px-4"
                  onClick={() => navigate("/chat")}
                >
                  <MessageSquareText className="w-4 h-4 mr-1.5" /> Chat IA
                </Button>
                <Button
                  size="sm"
                  className="hidden sm:inline-flex liquid-glass-btn !text-primary hover:!text-primary rounded-full uppercase text-xs tracking-wider font-medium px-4 h-9"
                  onClick={async () => { await signOut(); navigate("/"); }}
                >
                  <LogOut className="w-4 h-4 mr-1.5" /> Sair
                </Button>
              </>
            ) : (
              <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex text-foreground hover:text-primary hover:bg-primary/10 rounded-full uppercase text-xs tracking-wider font-medium px-4"
                onClick={() => navigate("/auth")}
              >
                <LogIn className="w-4 h-4 mr-1.5" /> Entrar
              </Button>
              <Button
                size="sm"
                className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full uppercase text-xs tracking-wider font-medium px-4 h-9 shadow-soft"
                onClick={() => navigate("/auth?mode=signup")}
              >
                <Calendar className="w-4 h-4 mr-1.5" /> Marcar Consulta
              </Button>
              </>
            )}
            <button
              onClick={() => setOpen(true)}
              className="w-10 h-10 rounded-full liquid-glass-btn flex items-center justify-center group"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen menu — clinical green overlay */}
      <div
        className={`fixed inset-0 z-50 bg-primary text-primary-foreground transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="container-x flex items-center justify-between h-16">
          <Logo inverted />
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center hover:bg-background/10 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="container-x mt-12 md:mt-20 flex flex-col gap-2">
          {links.map((l, i) => (
            <button
              key={l.label}
              onClick={() => go(l.to)}
              style={{ animationDelay: open ? `${i * 70}ms` : "0ms" }}
              className={`text-left font-serif text-2xl md:text-4xl py-3 border-b border-background/15 hover:pl-3 transition-all ${
                open ? "animate-fade-up" : ""
              }`}
            >
              {l.label}
            </button>
          ))}

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            {user ? (
              <>
                <Button onClick={() => go("/dashboard")} variant="outline" className="rounded-none border-background text-background hover:bg-background hover:text-primary uppercase tracking-wider">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Painel
                </Button>
                <Button onClick={() => go("/chat")} variant="outline" className="rounded-none border-background text-background hover:bg-background hover:text-primary uppercase tracking-wider">
                  <MessageSquareText className="w-4 h-4 mr-2" /> Chat IA
                </Button>
                <Button onClick={async () => { setOpen(false); await signOut(); navigate("/"); }} variant="outline" className="rounded-none border-background text-background hover:bg-background hover:text-primary uppercase tracking-wider">
                  <LogOut className="w-4 h-4 mr-2" /> Sair
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => go("/auth")} variant="outline" className="rounded-none border-background text-background hover:bg-background hover:text-primary uppercase tracking-wider">
                  <LogIn className="w-4 h-4 mr-2" /> Iniciar Sessão
                </Button>
                <Button onClick={() => go("/auth?mode=signup")} className="rounded-none bg-background text-primary hover:bg-background/90 uppercase tracking-wider">
                  Registar-se
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};
