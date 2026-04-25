import { Plus } from "lucide-react";

export const Logo = ({ className = "", inverted = false }: { className?: string; inverted?: boolean }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div className={`w-10 h-10 rounded-full border-2 ${inverted ? "border-background" : "border-primary"} flex items-center justify-center`}>
      <Plus className={`w-5 h-5 ${inverted ? "text-background" : "text-primary"}`} strokeWidth={2.5} />
    </div>
    <div className="flex flex-col leading-tight">
      <span className={`font-serif text-base tracking-wider uppercase ${inverted ? "text-background" : "text-foreground"}`}>
        MedicTech
      </span>
      <span className={`text-[10px] tracking-[0.2em] uppercase ${inverted ? "text-background/60" : "text-muted-foreground"}`}>
        Triagem médica
      </span>
    </div>
  </div>
);
