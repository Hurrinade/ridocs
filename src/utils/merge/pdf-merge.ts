import dayjs from "dayjs";
import { PDFDocument } from "pdf-lib";
import type { PdfMergeItem } from "@/types/merge/merge.types";

const PDF_MIME_TYPE = "application/pdf";
const PDF_EXTENSION = ".pdf";

function getPdfFileSignature(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export function isPdfFile(file: File) {
  return (
    file.type === PDF_MIME_TYPE ||
    file.name.toLowerCase().endsWith(PDF_EXTENSION)
  );
}

export function isDuplicatePdfFile(items: PdfMergeItem[], file: File) {
  const signature = getPdfFileSignature(file);

  return items.some((item) => getPdfFileSignature(item.file) === signature);
}

export async function createPdfMergeItem(
  file: File,
  order: number,
): Promise<PdfMergeItem> {
  const bytes = await file.arrayBuffer();
  const document = await PDFDocument.load(bytes);

  return {
    id: `${getPdfFileSignature(file)}:${crypto.randomUUID()}`,
    file,
    fileName: file.name,
    fileSize: file.size,
    pageCount: document.getPageCount(),
    previewUrl: URL.createObjectURL(file),
    order,
  };
}

export function normalizePdfMergeItems(items: PdfMergeItem[]) {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

export function movePdfMergeItems(
  items: PdfMergeItem[],
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

  return normalizePdfMergeItems(nextItems);
}

export async function mergePdfFiles(items: PdfMergeItem[]) {
  const mergedDocument = await PDFDocument.create();

  for (const item of items) {
    const sourceBytes = await item.file.arrayBuffer();
    const sourceDocument = await PDFDocument.load(sourceBytes);
    const copiedPages = await mergedDocument.copyPages(
      sourceDocument,
      sourceDocument.getPageIndices(),
    );

    copiedPages.forEach((page) => {
      mergedDocument.addPage(page);
    });
  }

  return mergedDocument.save();
}

export function downloadMergedPdf(
  bytes: Uint8Array,
  fileName = `rinament-merge-${dayjs().format("YYYY-MM-DD-HHmm")}.pdf`,
) {
  const blob = new Blob([Uint8Array.from(bytes).buffer], {
    type: PDF_MIME_TYPE,
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(objectUrl);
}

export function revokePdfMergeItem(item: PdfMergeItem) {
  URL.revokeObjectURL(item.previewUrl);
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: exponent === 0 ? 0 : 1,
  }).format(value)} ${units[exponent]}`;
}
