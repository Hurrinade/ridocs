import { useState } from "react";
import { useReorderableDrag } from "@/hooks/use-reorderable-drag";
import type {
  OrganizeStatus,
  PdfOrganizeDocument,
  PdfOrganizePageItem,
} from "@/types/organize/organize.types";
import {
  createPdfOrganizeDocument,
  downloadOrganizedPdf,
  isSupportedOrganizeFile,
  movePdfOrganizePages,
  removePdfOrganizePage,
  revokePdfOrganizeDocument,
  rotatePdfOrganizePage,
  saveOrganizedPdf,
} from "@/utils/organize/pdf-organize";

const INVALID_FILE_MESSAGE = "Only PDF files can be organized.";
const LOAD_ERROR_MESSAGE = "This PDF could not be opened.";
const SAVE_ERROR_MESSAGE = "The organized PDF could not be saved.";

export function usePdfOrganizerWorkspace() {
  const [document, setDocument] = useState<PdfOrganizeDocument | null>(null);
  const [pages, setPages] = useState<PdfOrganizePageItem[]>([]);
  const [status, setStatus] = useState<OrganizeStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const {
    activeDragId,
    endDrag,
    handleDragEnd,
    handleDragStart,
    reorderItems,
    startDrag,
  } = useReorderableDrag({
    onReorder(sourceIndex, targetIndex) {
      setPages((currentPages) =>
        movePdfOrganizePages(currentPages, sourceIndex, targetIndex),
      );
    },
  });

  async function loadFile(nextFile: File | null) {
    if (!nextFile) {
      return;
    }

    const hadDocument = document != null;

    if (!isSupportedOrganizeFile(nextFile)) {
      setMessage(INVALID_FILE_MESSAGE);
      setStatus(hadDocument ? "ready" : "idle");
      return;
    }

    setStatus("loading-file");
    setMessage(null);

    try {
      const nextState = await createPdfOrganizeDocument(nextFile);

      setDocument((currentDocument) => {
        if (currentDocument) {
          revokePdfOrganizeDocument(currentDocument);
        }

        return nextState.document;
      });
      setPages(nextState.pages);
      setStatus("ready");
    } catch (error) {
      console.error("Unable to prepare PDF for organizing:", error);
      setMessage(LOAD_ERROR_MESSAGE);
      setStatus(hadDocument ? "ready" : "error");
    }
  }

  function clearDocument() {
    setDocument((currentDocument) => {
      if (currentDocument) {
        revokePdfOrganizeDocument(currentDocument);
      }

      return null;
    });
    setPages([]);
    setStatus("idle");
    setMessage(null);
    endDrag();
  }

  function removePage(itemId: string) {
    setPages((currentPages) => removePdfOrganizePage(currentPages, itemId));
  }

  function rotatePage(itemId: string) {
    setPages((currentPages) => rotatePdfOrganizePage(currentPages, itemId));
  }

  async function saveDocument() {
    if (!document || pages.length === 0) {
      return;
    }

    setStatus("saving");
    setMessage(null);

    try {
      const savedBytes = await saveOrganizedPdf(document, pages);
      downloadOrganizedPdf(savedBytes, document.fileName);
      setStatus("ready");
    } catch (error) {
      console.error("Unable to save organized PDF:", error);
      setMessage(SAVE_ERROR_MESSAGE);
      setStatus("error");
    }
  }

  return {
    activeDragId,
    canSave:
      document != null &&
      pages.length > 0 &&
      status !== "loading-file" &&
      status !== "saving",
    clearDocument,
    document,
    endDrag,
    handleDragEnd,
    handleDragStart,
    loadFile,
    message,
    pages,
    removePage,
    reorderPages: reorderItems,
    rotatePage,
    saveDocument,
    startDrag,
    status,
  };
}
