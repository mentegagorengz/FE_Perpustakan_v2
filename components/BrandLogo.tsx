import { BookOpen } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  theme?: "light" | "dark";
}

export function BrandLogo({ className = "", theme = "dark" }: BrandLogoProps) {
  const isDark = theme === "dark";
  
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Icon Box */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#396c36] shadow-sm">
        <BookOpen size={24} color="white" strokeWidth={1.5} />
      </div>

      {/* Text Container */}
      <div className="flex flex-col justify-center gap-1">
        <h1 className={`text-xl font-bold leading-none tracking-tight ${isDark ? 'text-white' : 'text-[#171f26]'}`}>
          Perpustakaan
        </h1>
        <p className={`text-[15px] font-medium leading-none ${isDark ? 'text-white/80' : 'text-[#5c677d]'}`}>
          Cakrawala
        </p>
      </div>
    </div>
  );
}
