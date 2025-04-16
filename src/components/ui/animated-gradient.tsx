
import { cn } from "@/lib/utils";

export const AnimatedGradient = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 -z-10 h-full w-full", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-indigo-200 to-gray-200 dark:from-blue-900 dark:via-indigo-900 dark:to-gray-800 animate-gradient bg-gradient-size" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
    </div>
  );
};
