import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { FilePlus2, FileUp } from "lucide-react";
import MergeQueueCard, {
  MergeQueueCardOverlay,
} from "@/components/merge/MergeQueueCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/modals/use-modal";
import type { PdfMergeItem } from "@/types/merge/merge.types";
import { usePdfMergeWorkspace } from "@/hooks/merge/use-pdf-merge-workspace";

export default function MergeCanvas() {
  const {
    activeDragId,
    addFiles,
    canMerge,
    exportMergedDocument,
    finishDrag,
    items,
    removeItem,
    reorderItems,
    startDrag,
    status,
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
        onDragEnter={() => setIsDragActive(true)}
        onDragLeave={() => setIsDragActive(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDrop={(event) => void handleDrop(event)}
      >
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <div className="flex size-16 items-center justify-center rounded-[1.4rem] border border-foreground/15 bg-foreground/10 text-foreground">
              <FileUp className="size-7" />
            </div>
            <div className="space-y-2">
              <p className="font-heading text-[1.9rem] tracking-[-0.03em] text-foreground">
                Drop PDFs here
              </p>
              <p className="text-sm text-muted-foreground">
                Or click to upload.
              </p>
            </div>
          </div>
        ) : (
          <DragDropProvider
            onDragEnd={(event) => {
              const { source } = event.operation;

              finishDrag();

              if (event.canceled || !isSortable(source)) {
                return;
              }

              const { initialIndex, index } = source;

              if (initialIndex !== index) {
                reorderItems(initialIndex, index);
              }
            }}
            onDragStart={(event) => {
              startDrag(
                event.operation.source?.id
                  ? String(event.operation.source.id)
                  : null,
              );
            }}
          >
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-4 xl:grid-cols-5">
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
            <Button
              className="absolute top-4 right-4 z-20 rounded-full shadow-[0_16px_32px_rgb(33_24_18_/_0.12)] sm:top-6 sm:right-6"
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

            {canMerge ? (
              <Button
                className="absolute text-xl h-25 w-25 rounded-full right-4 bottom-4 z-20 bg-foreground sm:right-6 sm:bottom-6"
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
