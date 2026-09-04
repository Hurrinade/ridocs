import type { PdfPageQuarterTurn } from "@/types/common/common.type";

export type OrganizeStatus =
  | "idle"
  | "loading-file"
  | "ready"
  | "saving"
  | "error";

export type PdfOrganizePageRotation = PdfPageQuarterTurn;

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
