export type PhotoToPdfPageSize = "original" | "a4" | "letter";

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
