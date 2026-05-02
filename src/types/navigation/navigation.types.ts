import type { LucideIcon } from "lucide-react";

export type PdfToolNavItem = {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  disabled?: boolean;
};
