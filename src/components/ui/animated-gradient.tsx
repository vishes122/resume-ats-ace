
import { cn } from "@/lib/utils";

export const AnimatedGradient = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 -z-10 h-full w-full", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 animate-gradient" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
    </div>
  );
};
