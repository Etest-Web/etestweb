import { SpinnerGap } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils"

function Spinner({ className }: { className?: string }) {
  return (
    <SpinnerGap
      aria-hidden
      className={cn("h-4 w-4 animate-spin", className)}
    />
  )
}

export { Spinner }
