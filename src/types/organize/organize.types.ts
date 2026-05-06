export type OrganizeStatus =
  | "idle"
  | "loading-file"
  | "ready"
  | "saving"
  | "error";

export type PdfOrganizeDocument = {
  file: File;
  fileName: string;
  fileSize: number;
  pageCount: number;
  previewUrl: string;
};

export type PdfOrganizePageItem = {
  id: string;
  order: number;
  sourcePageIndex: number;
};
