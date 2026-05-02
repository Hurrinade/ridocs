import { useState } from "react";
import type { MergeStatus, PdfMergeItem } from "@/types/merge/merge.types";
import {
  createPdfMergeItem,
  downloadMergedPdf,
  isDuplicatePdfFile,
  isPdfFile,
  mergePdfFiles,
  movePdfMergeItems,
  normalizePdfMergeItems,
  revokePdfMergeItem,
} from "@/utils/merge/pdf-merge";

export function usePdfMergeWorkspace() {
  const [items, setItems] = useState<PdfMergeItem[]>([]);
  const [status, setStatus] = useState<MergeStatus>("idle");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  async function addFiles(nextFiles: File[] | FileList) {
    const incomingFiles = Array.from(nextFiles);

    if (incomingFiles.length === 0) {
      return;
    }

    const existingItems = items;
    const acceptedFiles: File[] = [];

    for (const file of incomingFiles) {
      if (!isPdfFile(file)) {
        continue;
      }

      const isDuplicate =
        isDuplicatePdfFile(existingItems, file) ||
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
      setStatus(existingItems.length > 0 ? "ready" : "idle");
      return;
    }

    setStatus("loading-files");

    const createdItems: PdfMergeItem[] = [];

    for (const [index, file] of acceptedFiles.entries()) {
      try {
        const item = await createPdfMergeItem(
          file,
          existingItems.length + createdItems.length + index + 1,
        );
        createdItems.push(item);
      } catch (error) {
        console.error("Unable to prepare PDF for merge:", error);
      }
    }

    const nextItems = normalizePdfMergeItems([
      ...existingItems,
      ...createdItems,
    ]);

    setItems(nextItems);
    setStatus(nextItems.length > 0 ? "ready" : "idle");
  }

  function removeItem(itemId: string) {
    const itemToRemove = items.find((item) => item.id === itemId);

    if (!itemToRemove) {
      return;
    }

    revokePdfMergeItem(itemToRemove);

    const nextItems = normalizePdfMergeItems(
      items.filter((item) => item.id !== itemId),
    );

    setItems(nextItems);
    setStatus(nextItems.length > 0 ? "ready" : "idle");
  }

  function clearItems() {
    items.forEach((item) => {
      revokePdfMergeItem(item);
    });

    setItems([]);
    setStatus("idle");
  }

  function startDrag(itemId: string | null) {
    setActiveDragId(itemId);
  }

  function finishDrag() {
    setActiveDragId(null);
  }

  function reorderItems(sourceIndex: number, targetIndex: number) {
    setItems((currentItems) =>
      movePdfMergeItems(currentItems, sourceIndex, targetIndex),
    );
  }

  async function exportMergedDocument() {
    if (items.length < 2) {
      return;
    }

    setStatus("merging");

    try {
      const mergedBytes = await mergePdfFiles(items);
      downloadMergedPdf(mergedBytes);
      setStatus("ready");
    } catch (error) {
      console.error("Unable to merge PDFs:", error);
      setStatus("error");
    }
  }

  return {
    activeDragId,
    addFiles,
    canMerge:
      items.length > 1 && status !== "loading-files" && status !== "merging",
    clearItems,
    exportMergedDocument,
    finishDrag,
    items,
    removeItem,
    reorderItems,
    startDrag,
    status,
  };
}
