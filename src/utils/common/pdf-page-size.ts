import { degrees, type PDFDocument, type PDFPage } from "pdf-lib";
import type {
  PdfPageQuarterTurn,
  PdfPageSize,
} from "@/types/common/common.type";

const A4_PAGE_SIZE: [number, number] = [595.28, 841.89];
const LETTER_PAGE_SIZE: [number, number] = [612, 792];
const PAGE_QUARTER_TURNS: PdfPageQuarterTurn[] = [0, 90, 180, 270];

function getDrawOrigin(
  rotation: PdfPageQuarterTurn,
  offsetX: number,
  offsetY: number,
  scaledWidth: number,
  scaledHeight: number,
) {
  if (rotation === 90) {
    return { x: offsetX, y: offsetY + scaledWidth };
  }

  if (rotation === 180) {
    return { x: offsetX + scaledWidth, y: offsetY + scaledHeight };
  }

  if (rotation === 270) {
    return { x: offsetX + scaledHeight, y: offsetY };
  }

  return { x: offsetX, y: offsetY };
}

export function normalizePdfPageRotation(rotation: number): PdfPageQuarterTurn {
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  return PAGE_QUARTER_TURNS.includes(normalizedRotation as PdfPageQuarterTurn)
    ? (normalizedRotation as PdfPageQuarterTurn)
    : 0;
}

export function getFixedPdfPageSize(
  pageSize: PdfPageSize,
): [number, number] | null {
  if (pageSize === "a4") {
    return A4_PAGE_SIZE;
  }

  if (pageSize === "letter") {
    return LETTER_PAGE_SIZE;
  }

  return null;
}

export function getPdfPageSize(
  pageSize: PdfPageSize,
  width: number,
  height: number,
): [number, number] {
  return getFixedPdfPageSize(pageSize) ?? [width, height];
}

export async function addNormalizedPdfPage(
  targetDocument: PDFDocument,
  sourcePage: PDFPage,
  pageSize: PdfPageSize,
  extraRotation = 0,
) {
  const fixedPageSize = getFixedPdfPageSize(pageSize);

  if (!fixedPageSize) {
    return;
  }

  const [portraitWidth, portraitHeight] = fixedPageSize;
  const embeddedPage = await targetDocument.embedPage(sourcePage);
  const contentWidth = embeddedPage.width;
  const contentHeight = embeddedPage.height;

  // embedPage ignores the source page /Rotate, so it is folded into the draw transform.
  const rotation = normalizePdfPageRotation(
    sourcePage.getRotation().angle + extraRotation,
  );
  const isQuarterTurn = rotation === 90 || rotation === 270;
  const visualWidth = isQuarterTurn ? contentHeight : contentWidth;
  const visualHeight = isQuarterTurn ? contentWidth : contentHeight;

  const isLandscape = visualWidth > visualHeight;
  const targetWidth = isLandscape ? portraitHeight : portraitWidth;
  const targetHeight = isLandscape ? portraitWidth : portraitHeight;

  const scale = Math.min(
    targetWidth / visualWidth,
    targetHeight / visualHeight,
  );
  const scaledWidth = contentWidth * scale;
  const scaledHeight = contentHeight * scale;
  const offsetX = (targetWidth - visualWidth * scale) / 2;
  const offsetY = (targetHeight - visualHeight * scale) / 2;

  const page = targetDocument.addPage([targetWidth, targetHeight]);

  page.drawPage(embeddedPage, {
    ...getDrawOrigin(rotation, offsetX, offsetY, scaledWidth, scaledHeight),
    width: scaledWidth,
    height: scaledHeight,
    // PDF page rotation is clockwise while pdf-lib draw rotation is counter-clockwise.
    rotate: degrees(-rotation),
  });
}
