import { Card, CardTitle } from "@/components/ui/card";
import type { PdfToolNavItem } from "@/types";

export default function ToolCardItem({ item }: { item: PdfToolNavItem }) {
  const Icon = item.icon;
  return (
    <Card className="h-full border-none bg-card/95 py-5 flex flex-col items-center w-50 text-foreground">
      <Icon className="size-8" />
      <CardTitle className="!text-lg font-bold">{item.label}</CardTitle>
    </Card>
  );
}
