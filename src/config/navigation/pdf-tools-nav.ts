import { FileStack, Rows3 } from "lucide-react";
import type { PdfToolNavItem } from "@/types";

export const pdfToolsNavItems: PdfToolNavItem[] = [
  {
    key: "merge",
    label: "Merge PDFs",
    path: "/merge",
    icon: FileStack,
  },
  {
    key: "organize",
    label: "Organize PDF",
    path: "/organize",
    icon: Rows3,
  },
];
