import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { RefreshCw, Save, Trash2 } from "lucide-react";
import {
  OrganizePageCardOverlay,
  default as OrganizePageCard,
} from "@/components/organize/OrganizePageCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePdfOrganizerWorkspace } from "@/hooks/organize/use-pdf-organizer-workspace";
import { formatFileSize } from "@/utils/merge/pdf-merge";
import Dropzone from "@/components/common/Dropzone";
import WorkspaceStat from "@/components/common/WorkspaceStat";

export default function OrganizeCanvas() {
  const {
    activeDragId,
    canSave,
    clearDocument,
    document,
    handleDragEnd,
    handleDragStart,
    loadFile,
    message,
    pages,
    removePage,
    saveDocument,
    status,
  } = usePdfOrganizerWorkspace();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const activeItem = pages.find((item) => item.id === activeDragId) ?? null;

  function openFilePicker() {
    inputRef.current?.click();
  }

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;

    await loadFile(nextFile);
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);

    const nextFile = event.dataTransfer.files[0] ?? null;

    await loadFile(nextFile);
  }

  return (
    <div className="relative min-h-svh overflow-hidden">
      <input
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => void handleInputChange(event)}
        ref={inputRef}
        type="file"
      />

      <div
        className={cn(
          "relative flex min-h-svh flex-col",
          isDragActive ? "bg-foreground/8" : "bg-transparent",
        )}
        onClick={() => {
          if (!document) {
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
        {!document ? (
          <Dropzone title="Drop PDF here" description="Or click to upload." />
        ) : (
          <DragDropProvider
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <div className="rounded-[2rem] border border-border/70 bg-card/92 p-5 shadow-[0_30px_70px_rgb(36_27_21_/_0.08)] sm:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[0.72rem] uppercase tracking-[0.26em] text-muted-foreground">
                        PDF Organizer
                      </p>
                      <h1 className="font-heading text-3xl leading-none tracking-[-0.04em] text-foreground sm:text-4xl">
                        {document.fileName}
                      </h1>
                      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                        Drag cards to change the reading order, or delete pages
                        you do not want in the final export.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <WorkspaceStat
                        label="Original pages"
                        value={document.pageCount}
                      />
                      <WorkspaceStat label="Pages kept" value={pages.length} />
                      <WorkspaceStat
                        label="File size"
                        value={formatFileSize(document.fileSize)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                    <Button
                      className="rounded-full text-background px-5"
                      disabled={!canSave}
                      onClick={(event) => {
                        event.stopPropagation();
                        void saveDocument();
                      }}
                      type="button"
                    >
                      <Save className="size-4" />
                      {status === "saving" ? "Saving..." : "Save PDF"}
                    </Button>
                    <Button
                      className="rounded-full px-4"
                      onClick={(event) => {
                        event.stopPropagation();
                        openFilePicker();
                      }}
                      type="button"
                      variant="outline"
                    >
                      <RefreshCw className="size-4" />
                      Replace PDF
                    </Button>
                    <Button
                      className="rounded-full px-4"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearDocument();
                      }}
                      type="button"
                      variant="outline"
                    >
                      <Trash2 className="size-4" />
                      Clear
                    </Button>
                  </div>
                </div>

                {message ? (
                  <p className="mt-4 text-sm text-destructive">{message}</p>
                ) : null}
              </div>

              {pages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-4 xl:grid-cols-5">
                  {pages.map((item) => (
                    <OrganizePageCard
                      file={document.previewUrl}
                      item={item}
                      key={item.id}
                      onRemove={removePage}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex min-h-60 items-center justify-center rounded-[2rem] border border-dashed border-border/80 bg-card/70 px-6 text-center">
                  <div className="max-w-md space-y-3">
                    <p className="font-heading text-3xl leading-none tracking-[-0.03em] text-foreground">
                      No pages left to export
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Replace this PDF to start over, or keep this file open and
                      restore pages by uploading it again.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeItem ? (
                <div className="w-full max-w-[19rem]">
                  <OrganizePageCardOverlay
                    file={document.previewUrl}
                    item={activeItem}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DragDropProvider>
        )}
      </div>
    </div>
  );
}
