import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  isLoading?: boolean;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, isLoading, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "font-sans group relative w-full cursor-pointer overflow-hidden rounded-full border bg-zinc-900 p-3 text-center font-semibold text-white transition-all duration-300 hover:bg-zinc-800",
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
           <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Acessando...</span>
        </div>
      ) : (
        <>
          <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
            {text}
          </span>
          <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
            <span>{text}</span>
            <ArrowRight size={18} />
          </div>
          {/* Adjusted background circle color to match design system accent */}
          <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-lg bg-zinc-700 transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-zinc-700/50"></div>
        </>
      )}
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };