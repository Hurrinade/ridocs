import { FileStack, Rows3 } from "lucide-react";
import type { PdfToolNavItem } from "@/types";

export const pdfToolsNavItems: PdfToolNavItem[] = [
  {
    key: "merge",
    label: "Merge PDFs",
    path: "/merge",
    icon: FileStack,
    description:
      "Combine multiple PDF files into one document and arrange their order before exporting.",
  },
  {
    key: "organize",
    label: "Organize PDF",
    path: "/organize",
    icon: Rows3,
    description:
      "Reorder pages in a single PDF and remove pages you do not want before saving.",
  },
];
