import dayjs from "dayjs";
import { degrees, PDFDocument } from "pdf-lib";
import { downloadMergedPdf, isPdfFile } from "@/utils/merge/pdf-merge";
import type {
  PdfOrganizeDocument,
  PdfOrganizePageItem,
  PdfOrganizePageRotation,
} from "@/types/organize/organize.types";

const PAGE_ROTATIONS: PdfOrganizePageRotation[] = [0, 90, 180, 270];

function buildPdfOrganizePageItems(pageCount: number): PdfOrganizePageItem[] {
  return Array.from({ length: pageCount }, (_, index) => ({
    id: crypto.randomUUID(),
    order: index + 1,
    rotation: 0,
    sourcePageIndex: index,
  }));
}

function normalizePageRotation(rotation: number): PdfOrganizePageRotation {
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  return PAGE_ROTATIONS.includes(normalizedRotation as PdfOrganizePageRotation)
    ? (normalizedRotation as PdfOrganizePageRotation)
    : 0;
}

export function normalizePdfOrganizePages(items: PdfOrganizePageItem[]) {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

export async function createPdfOrganizeDocument(file: File): Promise<{
  document: PdfOrganizeDocument;
  pages: PdfOrganizePageItem[];
}> {
  const bytes = await file.arrayBuffer();
  const pdfDocument = await PDFDocument.load(bytes);
  const pageCount = pdfDocument.getPageCount();

  return {
    document: {
      file,
      fileName: file.name,
      fileSize: file.size,
      pageCount,
      previewUrl: URL.createObjectURL(file),
    },
    pages: buildPdfOrganizePageItems(pageCount),
  };
}

export function isSupportedOrganizeFile(file: File) {
  return isPdfFile(file);
}

export function movePdfOrganizePages(
  items: PdfOrganizePageItem[],
  sourceIndex: number,
  targetIndex: number,
) {
  if (
    sourceIndex < 0 ||
    targetIndex < 0 ||
    sourceIndex >= items.length ||
    targetIndex >= items.length ||
    sourceIndex === targetIndex
  ) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(sourceIndex, 1);
  nextItems.splice(targetIndex, 0, movedItem);

  return normalizePdfOrganizePages(nextItems);
}

export function removePdfOrganizePage(
  items: PdfOrganizePageItem[],
  itemId: string,
) {
  return normalizePdfOrganizePages(items.filter((item) => item.id !== itemId));
}

export function rotatePdfOrganizePage(
  items: PdfOrganizePageItem[],
  itemId: string,
) {
  return items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          rotation: normalizePageRotation(item.rotation + 90),
        }
      : item,
  );
}

export async function saveOrganizedPdf(
  document: PdfOrganizeDocument,
  pages: PdfOrganizePageItem[],
) {
  const sourceBytes = await document.file.arrayBuffer();
  const sourceDocument = await PDFDocument.load(sourceBytes);
  const nextDocument = await PDFDocument.create();

  for (const pageItem of pages) {
    const [copiedPage] = await nextDocument.copyPages(sourceDocument, [
      pageItem.sourcePageIndex,
    ]);

    copiedPage.setRotation(
      degrees(
        normalizePageRotation(
          copiedPage.getRotation().angle + pageItem.rotation,
        ),
      ),
    );
    nextDocument.addPage(copiedPage);
  }

  return nextDocument.save();
}

export function downloadOrganizedPdf(
  bytes: Uint8Array,
  originalFileName: string,
) {
  downloadMergedPdf(bytes, getOrganizedPdfFileName(originalFileName));
}

export function getOrganizedPdfFileName(originalFileName: string) {
  const trimmedName = originalFileName.replace(/\.pdf$/i, "");

  return `${trimmedName}-organized-${dayjs().format("YYYY-MM-DD-HHmm")}.pdf`;
}

export function revokePdfOrganizeDocument(document: PdfOrganizeDocument) {
  URL.revokeObjectURL(document.previewUrl);
}
