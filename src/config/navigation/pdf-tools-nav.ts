import { Archive, FileImage, FileStack, Rows3 } from "lucide-react";
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
      "Reorder, rotate, and remove pages in a single PDF before saving.",
  },
  {
    key: "photo-to-pdf",
    label: "Photo to PDF",
    path: "/photo-to-pdf",
    icon: FileImage,
    description:
      "Convert JPG photos into PDF pages, adjust page size, and export one combined PDF or separate files.",
  },
  {
    key: "compress",
    label: "Compress PDF",
    path: "/compress",
    icon: Archive,
    description: "Reduce PDF file size for easier sharing.",
    disabled: true,
  },
];
