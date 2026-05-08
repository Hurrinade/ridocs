import { FileImage, FileStack, Rows3 } from "lucide-react";
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
  {
    key: "photo-to-pdf",
    label: "Photo to PDF",
    path: "/photo-to-pdf",
    icon: FileImage,
    description:
      "Convert JPG photos into PDF pages, adjust page size, and export one combined PDF or separate files.",
  },
];
