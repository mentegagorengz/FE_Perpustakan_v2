import { Leaf } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 24 }: LogoProps) {
  // To make the background box proportional to the icon size
  const boxSize = size * 2; 

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[#366935] ${className}`}
      style={{ width: boxSize, height: boxSize }}
    >
      <Leaf size={size} color="white" strokeWidth={1.5} />
    </div>
  );
}
