import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { FilePlus2, Trash2 } from "lucide-react";
import MergeQueueCard, {
  MergeQueueCardOverlay,
} from "@/components/merge/MergeQueueCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/modals/use-modal";
import type { PdfMergeItem } from "@/types/merge/merge.types";
import { usePdfMergeWorkspace } from "@/hooks/merge/use-pdf-merge-workspace";
import Dropzone from "@/components/common/Dropzone";
import PdfPageSizeSelect from "@/components/common/PdfPageSizeSelect";

export default function MergeCanvas() {
  const {
    activeDragId,
    addFiles,
    canMerge,
    clearItems,
    exportMergedDocument,
    handleDragEnd,
    handleDragStart,
    items,
    pageSize,
    removeItem,
    status,
    updatePageSize,
  } = usePdfMergeWorkspace();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const { openModal } = useModal();

  const activeItem = items.find((item) => item.id === activeDragId) ?? null;

  function openFilePicker() {
    inputRef.current?.click();
  }

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files) {
      return;
    }

    await addFiles(files);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);

    if (event.dataTransfer.files.length === 0) {
      return;
    }

    await addFiles(event.dataTransfer.files);
  }

  function openDetails(item: PdfMergeItem) {
    openModal("pdfDetails", {
      item,
      onRemove: removeItem,
    });
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <input
        accept="application/pdf,.pdf"
        className="sr-only"
        multiple
        onChange={(event) => void handleInputChange(event)}
        ref={inputRef}
        type="file"
      />

      <div
        className={cn(
          "relative flex min-h-svh flex-col transition-colors",
          isDragActive ? "bg-foreground/8" : "bg-transparent",
        )}
        onClick={() => {
          if (items.length === 0) {
            openFilePicker();
          }
        }}
        onDragEnter={() => {
          setIsDragActive(true);
        }}
        onDragLeave={() => {
          setIsDragActive(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDrop={(event) => void handleDrop(event)}
      >
        {items.length === 0 ? (
          <Dropzone title="Drop PDFs here" description="Or click to upload." />
        ) : (
          <DragDropProvider
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <div className="flex flex-wrap items-start gap-4 p-4">
              {items.map((item) => (
                <MergeQueueCard
                  isSelected={false}
                  item={item}
                  key={item.id}
                  onOpen={openDetails}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeItem ? (
                <div className="w-55">
                  <MergeQueueCardOverlay item={activeItem} />
                </div>
              ) : null}
            </DragOverlay>
          </DragDropProvider>
        )}

        {items.length > 0 ? (
          <>
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 sm:top-6 sm:right-6">
              <PdfPageSizeSelect
                className="w-36 rounded-full bg-card shadow-[0_16px_32px_rgb(33_24_18/0.12)]"
                disabled={status === "loading-files" || status === "merging"}
                onChange={updatePageSize}
                value={pageSize}
              />

              <Button
                className="rounded-full shadow-[0_16px_32px_rgb(33_24_18/0.12)]"
                disabled={status === "loading-files" || status === "merging"}
                onClick={(event) => {
                  event.stopPropagation();
                  clearItems();
                }}
                size="icon"
                type="button"
                variant="outline"
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Clear PDFs</span>
              </Button>

              <Button
                className="rounded-full shadow-[0_16px_32px_rgb(33_24_18/0.12)]"
                onClick={(event) => {
                  event.stopPropagation();
                  openFilePicker();
                }}
                size="icon"
                type="button"
                variant="outline"
              >
                <FilePlus2 className="size-4" />
                <span className="sr-only">Add PDFs</span>
              </Button>
            </div>

            {canMerge ? (
              <Button
                className="absolute text-xl h-25 w-25 rounded-full right-4 bottom-4 z-20 bg-foreground sm:right-6 sm:bottom-6 text-background"
                onClick={(event) => {
                  event.stopPropagation();
                  exportMergedDocument();
                }}
                type="button"
                variant="default"
              >
                {status === "merging" ? "Merging..." : "Merge"}
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
