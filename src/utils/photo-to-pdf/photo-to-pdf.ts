import dayjs from "dayjs";
import { PDFDocument } from "pdf-lib";
import type {
  PhotoToPdfItem,
  PhotoToPdfPageSize,
} from "@/types/photo-to-pdf/photo-to-pdf.types";
import { downloadMergedPdf } from "@/utils/merge/pdf-merge";
import { getPdfPageSize } from "@/utils/common/pdf-page-size";

const JPG_MIME_TYPE = "image/jpeg";
const JPG_EXTENSIONS = [".jpg", ".jpeg"];
const PDF_MIME_TYPE = "application/pdf";

function getPhotoFileSignature(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function getPhotoToPdfBaseName(fileName: string) {
  return fileName.replace(/\.jpe?g$/i, "");
}

async function createSinglePagePdf(
  file: File,
  pageSize: PhotoToPdfPageSize,
): Promise<{
  pdfFile: File;
  width: number;
  height: number;
}> {
  const bytes = await file.arrayBuffer();
  const pdfDocument = await PDFDocument.create();
  const embeddedImage = await pdfDocument.embedJpg(bytes);
  const { width, height } = embeddedImage.scale(1);
  const [pageWidth, pageHeight] = getPdfPageSize(pageSize, width, height);
  const page = pdfDocument.addPage([pageWidth, pageHeight]);
  const scale = Math.min(pageWidth / width, pageHeight / height);
  const drawWidth = width * scale;
  const drawHeight = height * scale;

  page.drawImage(embeddedImage, {
    x: (pageWidth - drawWidth) / 2,
    y: (pageHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  });

  const pdfBytes = Uint8Array.from(await pdfDocument.save());
  const pdfFile = new File(
    [pdfBytes],
    `${getPhotoToPdfBaseName(file.name)}.pdf`,
    {
      type: PDF_MIME_TYPE,
      lastModified: file.lastModified,
    },
  );

  return {
    pdfFile,
    width,
    height,
  };
}

export function isJpgFile(file: File) {
  return (
    file.type === JPG_MIME_TYPE ||
    JPG_EXTENSIONS.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    )
  );
}

export function isDuplicatePhotoToPdfFile(items: PhotoToPdfItem[], file: File) {
  const signature = getPhotoFileSignature(file);

  return items.some((item) => getPhotoFileSignature(item.file) === signature);
}

export async function createPhotoToPdfItem(
  file: File,
  order: number,
  pageSize: PhotoToPdfPageSize,
): Promise<PhotoToPdfItem> {
  const { pdfFile, width, height } = await createSinglePagePdf(file, pageSize);

  return {
    id: `${getPhotoFileSignature(file)}:${crypto.randomUUID()}`,
    file,
    pdfFile,
    fileName: file.name,
    fileSize: file.size,
    previewUrl: URL.createObjectURL(pdfFile),
    order,
    width,
    height,
  };
}

export async function regeneratePhotoToPdfItem(
  item: PhotoToPdfItem,
  pageSize: PhotoToPdfPageSize,
): Promise<PhotoToPdfItem> {
  const { pdfFile, width, height } = await createSinglePagePdf(
    item.file,
    pageSize,
  );

  return {
    ...item,
    pdfFile,
    previewUrl: URL.createObjectURL(pdfFile),
    width,
    height,
  };
}

export function normalizePhotoToPdfItems(items: PhotoToPdfItem[]) {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

export function movePhotoToPdfItems(
  items: PhotoToPdfItem[],
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

  return normalizePhotoToPdfItems(nextItems);
}

export async function exportCombinedPhotoPdf(items: PhotoToPdfItem[]) {
  const mergedDocument = await PDFDocument.create();

  for (const item of items) {
    const sourceBytes = await item.pdfFile.arrayBuffer();
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

export function downloadCombinedPhotoPdf(bytes: Uint8Array) {
  downloadMergedPdf(
    bytes,
    `ridocs-photo-to-pdf-${dayjs().format("YYYY-MM-DD-HHmm")}.pdf`,
  );
}

export async function downloadSeparatePhotoPdfs(items: PhotoToPdfItem[]) {
  const timestamp = dayjs().format("YYYY-MM-DD-HHmm");

  for (const item of items) {
    const pdfBytes = new Uint8Array(await item.pdfFile.arrayBuffer());

    downloadMergedPdf(
      pdfBytes,
      `${getPhotoToPdfBaseName(item.fileName)}-photo-to-pdf-${timestamp}.pdf`,
    );
  }
}

export function revokePhotoToPdfItem(item: PhotoToPdfItem) {
  URL.revokeObjectURL(item.previewUrl);
}
