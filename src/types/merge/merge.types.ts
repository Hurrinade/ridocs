export type MergeStatus =
  | "idle"
  | "loading-files"
  | "ready"
  | "merging"
  | "error";

export type PdfMergeItem = {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  pageCount: number;
  previewUrl: string;
  order: number;
};
