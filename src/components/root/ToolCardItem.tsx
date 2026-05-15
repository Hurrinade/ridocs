import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PdfToolNavItem } from "@/types";

export default function ToolCardItem({ item }: { item: PdfToolNavItem }) {
  const Icon = item.icon;
  return (
    <Card className="h-full w-64 border-none bg-card/95 py-5 text-foreground shadow-[0_18px_40px_rgb(36_27_21_/_0.08)]">
      <CardHeader className="flex h-full flex-col items-start gap-4 px-5">
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CardTitle className="!text-xl font-bold leading-tight">
              {item.label}
            </CardTitle>
            {item.disabled ? (
              <span className="rounded-full border border-border/70 bg-background/70 px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Soon
              </span>
            ) : null}
          </div>
          <CardDescription className="line-clamp-3 text-sm leading-6">
            {item.description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
