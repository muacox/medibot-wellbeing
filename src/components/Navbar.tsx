import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, LogOut, MessageSquareText, Menu, Home, Info, Mail, Calendar, Newspaper } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (to: string) => { setOpen(false); navigate(to); };

  const navLinks = [
    { to: "/", label: "Início", icon: Home },
    { to: "/#sobre", label: "Sobre", icon: Info },
    { to: "/#actualidade", label: "Actualidade", icon: Newspaper },
    { to: "/#eventos", label: "Eventos", icon: Calendar },
    { to: "/#contacto", label: "Contacto", icon: Mail },
  ];

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl animate-fade-up">
      <nav className="glass-strong rounded-full px-3 py-2 flex items-center justify-between transition-all duration-500 hover:shadow-glow">
        <Link to="/" className="pl-2 transition-transform hover:scale-105"><Logo /></Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.to)}
              className="text-sm font-medium px-3 py-1.5 rounded-full text-foreground/80 hover:text-foreground hover:bg-primary/10 transition-all relative group"
            >
              {l.label}
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-1/2 transition-all duration-300" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <Button size="sm" variant="ghost" className="rounded-full hidden sm:flex" onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft border-0 hidden sm:flex font-semibold" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-1.5" /> Entrar
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 transition-all hover:rotate-90 duration-300" aria-label="Menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] bg-background border-l">
              <SheetHeader className="text-left mb-6">
                <SheetTitle><Logo /></SheetTitle>
                <SheetDescription>Sistema de triagem médica inteligente</SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1">
                {navLinks.map((l, i) => (
                  <button
                    key={l.label}
                    onClick={() => go(l.to)}
                    style={{ animationDelay: `${i * 60}ms` }}
                    className="animate-fade-up flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 hover:translate-x-1 transition-all text-left font-medium"
                  >
                    <l.icon className="w-4 h-4 text-primary" />
                    {l.label}
                  </button>
                ))}

                <div className="h-px bg-border my-3" />

                {user ? (
                  <>
                    <button onClick={() => go("/dashboard")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 transition-all text-left font-medium">
                      <LayoutDashboard className="w-4 h-4 text-primary" /> Painel
                    </button>
                    <button onClick={() => go("/chat")} className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-primary/10 transition-all text-left font-medium">
                      <MessageSquareText className="w-4 h-4 text-primary" /> Chat IA
                    </button>
                    <Button onClick={async () => { setOpen(false); await signOut(); navigate("/"); }} variant="outline" className="mt-3 rounded-full">
                      <LogOut className="w-4 h-4 mr-2" /> Sair
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Button onClick={() => go("/auth")} variant="outline" className="rounded-full">
                      Iniciar Sessão
                    </Button>
                    <Button onClick={() => go("/auth?mode=signup")} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Registar-se
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
