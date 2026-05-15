export type OrganizeStatus =
  | "idle"
  | "loading-file"
  | "ready"
  | "saving"
  | "error";

export type PdfOrganizePageRotation = 0 | 90 | 180 | 270;

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
  rotation: PdfOrganizePageRotation;
  sourcePageIndex: number;
};
