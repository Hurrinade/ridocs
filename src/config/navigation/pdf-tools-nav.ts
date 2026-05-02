import { FileStack } from "lucide-react";
import type { PdfToolNavItem } from "@/types";

export const pdfToolsNavItems: PdfToolNavItem[] = [
  {
    key: "merge",
    label: "Merge PDFs",
    path: "/merge",
    icon: FileStack,
  },
];
