import { useState } from "react";
import { useReorderableDrag } from "@/hooks/use-reorderable-drag";
import type {
  PhotoToPdfItem,
  PhotoToPdfPageSize,
  PhotoToPdfStatus,
} from "@/types/photo-to-pdf/photo-to-pdf.types";
import {
  createPhotoToPdfItem,
  downloadCombinedPhotoPdf,
  downloadSeparatePhotoPdfs,
  exportCombinedPhotoPdf,
  isDuplicatePhotoToPdfFile,
  isJpgFile,
  movePhotoToPdfItems,
  normalizePhotoToPdfItems,
  regeneratePhotoToPdfItem,
  revokePhotoToPdfItem,
} from "@/utils/photo-to-pdf/photo-to-pdf";

const INVALID_FILE_MESSAGE = "Only JPG files are supported.";
const LOAD_ERROR_MESSAGE = "The selected photos could not be prepared.";
const EXPORT_ERROR_MESSAGE = "The PDF export could not be created.";

export function usePhotoToPdfWorkspace() {
  const [items, setItems] = useState<PhotoToPdfItem[]>([]);
  const [status, setStatus] = useState<PhotoToPdfStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<PhotoToPdfPageSize>("original");
  const [exportEachPhoto, setExportEachPhoto] = useState(false);

  const { activeDragId, endDrag, handleDragEnd, handleDragStart, startDrag } =
    useReorderableDrag({
      onReorder(sourceIndex, targetIndex) {
        setItems((currentItems) =>
          movePhotoToPdfItems(currentItems, sourceIndex, targetIndex),
        );
      },
    });

  async function addFiles(nextFiles: File[] | FileList) {
    const incomingFiles = Array.from(nextFiles);

    if (incomingFiles.length === 0) {
      return;
    }

    const existingItems = items;
    const acceptedFiles: File[] = [];
    let hasInvalidFiles = false;

    for (const file of incomingFiles) {
      if (!isJpgFile(file)) {
        hasInvalidFiles = true;
        continue;
      }

      const isDuplicate =
        isDuplicatePhotoToPdfFile(existingItems, file) ||
        acceptedFiles.some(
          (acceptedFile) =>
            acceptedFile.name === file.name &&
            acceptedFile.size === file.size &&
            acceptedFile.lastModified === file.lastModified,
        );

      if (isDuplicate) {
        continue;
      }

      acceptedFiles.push(file);
    }

    if (acceptedFiles.length === 0) {
      setMessage(hasInvalidFiles ? INVALID_FILE_MESSAGE : null);
      setStatus(existingItems.length > 0 ? "ready" : "idle");
      return;
    }

    setStatus("loading-files");
    setMessage(hasInvalidFiles ? INVALID_FILE_MESSAGE : null);

    const createdItems: PhotoToPdfItem[] = [];

    for (const [index, file] of acceptedFiles.entries()) {
      try {
        const item = await createPhotoToPdfItem(
          file,
          existingItems.length + createdItems.length + index + 1,
          pageSize,
        );
        createdItems.push(item);
      } catch (error) {
        console.error("Unable to prepare photo for PDF:", error);
      }
    }

    if (createdItems.length === 0) {
      setMessage(LOAD_ERROR_MESSAGE);
      setStatus(existingItems.length > 0 ? "ready" : "error");
      return;
    }

    const nextItems = normalizePhotoToPdfItems([
      ...existingItems,
      ...createdItems,
    ]);

    setItems(nextItems);
    setStatus("ready");
  }

  async function updatePageSize(nextPageSize: PhotoToPdfPageSize) {
    if (nextPageSize === pageSize) {
      return;
    }

    if (items.length === 0) {
      setPageSize(nextPageSize);
      return;
    }

    setStatus("loading-files");
    setMessage(null);

    try {
      const nextItems = await Promise.all(
        items.map((item) => regeneratePhotoToPdfItem(item, nextPageSize)),
      );

      items.forEach((item) => {
        revokePhotoToPdfItem(item);
      });

      setItems(normalizePhotoToPdfItems(nextItems));
      setPageSize(nextPageSize);
      setStatus("ready");
    } catch (error) {
      console.error("Unable to regenerate photo PDFs:", error);
      setMessage(LOAD_ERROR_MESSAGE);
      setStatus("error");
    }
  }

  function removeItem(itemId: string) {
    const itemToRemove = items.find((item) => item.id === itemId);

    if (!itemToRemove) {
      return;
    }

    revokePhotoToPdfItem(itemToRemove);

    const nextItems = normalizePhotoToPdfItems(
      items.filter((item) => item.id !== itemId),
    );

    setItems(nextItems);
    setMessage(null);
    setStatus(nextItems.length > 0 ? "ready" : "idle");
  }

  function clearItems() {
    items.forEach((item) => {
      revokePhotoToPdfItem(item);
    });

    setItems([]);
    setMessage(null);
    setStatus("idle");
    endDrag();
  }

  async function exportPdf() {
    if (items.length === 0) {
      return;
    }

    setStatus("exporting");
    setMessage(null);

    try {
      if (exportEachPhoto) {
        await downloadSeparatePhotoPdfs(items);
      } else {
        const mergedBytes = await exportCombinedPhotoPdf(items);
        downloadCombinedPhotoPdf(mergedBytes);
      }

      setStatus("ready");
    } catch (error) {
      console.error("Unable to export photo PDFs:", error);
      setMessage(EXPORT_ERROR_MESSAGE);
      setStatus("error");
    }
  }

  return {
    activeDragId,
    addFiles,
    canExport:
      items.length > 0 && status !== "loading-files" && status !== "exporting",
    clearItems,
    exportEachPhoto,
    exportPdf,
    handleDragEnd,
    handleDragStart,
    items,
    message,
    pageSize,
    removeItem,
    setExportEachPhoto,
    startDrag,
    status,
    updatePageSize,
  };
}
