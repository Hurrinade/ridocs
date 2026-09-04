import type { PdfPageSize } from "@/types/common/common.type";

export type PhotoToPdfPageSize = PdfPageSize;

export type PhotoToPdfStatus =
  | "idle"
  | "loading-files"
  | "ready"
  | "exporting"
  | "error";

export type PhotoToPdfItem = {
  id: string;
  file: File;
  pdfFile: File;
  fileName: string;
  fileSize: number;
  previewUrl: string;
  order: number;
  width: number;
  height: number;
};
