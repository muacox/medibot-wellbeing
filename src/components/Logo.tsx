import { Activity } from "lucide-react";

export const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-hero blur-md opacity-60 rounded-2xl" />
      <div className="relative w-9 h-9 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow">
        <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
      </div>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-bold text-lg tracking-tight">
        Medic<span className="text-gradient">Tech</span>
      </span>
    </div>
  </div>
);
