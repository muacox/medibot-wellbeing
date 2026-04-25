import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, LogOut, MessageSquareText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <nav className="glass-strong rounded-full px-4 py-2.5 flex items-center justify-between">
        <Link to="/" className="pl-2"><Logo /></Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="rounded-full hidden sm:flex" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="w-4 h-4 mr-1.5" /> Painel
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full hidden sm:flex" onClick={() => navigate("/chat")}>
                <MessageSquareText className="w-4 h-4 mr-1.5" /> Chat IA
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={async () => { await signOut(); navigate("/"); }}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="rounded-full" onClick={() => navigate("/auth")}>
                Entrar
              </Button>
              <Button size="sm" className="rounded-full bg-gradient-hero hover:opacity-90 shadow-glow border-0" onClick={() => navigate("/auth?mode=signup")}>
                <LogIn className="w-4 h-4 mr-1.5" /> Começar
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
