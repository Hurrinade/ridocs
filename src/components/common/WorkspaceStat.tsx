import { cn } from "@/lib/utils";
import type { WorkspaceStatProps } from "@/types";

export default function WorkspaceStat({
  label,
  value,
  className,
}: WorkspaceStatProps) {
  return (
    <div
      className={cn(
        "rounded-[1.35rem] border border-border/60 bg-background/70 px-4 py-3 max-w-max max-h-max text-center",
        className,
      )}
    >
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
