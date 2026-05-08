import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { ChevronDown, RefreshCw, Save, Trash2 } from "lucide-react";
import Dropzone from "@/components/common/Dropzone";
import PhotoToPdfQueueCard, {
  PhotoToPdfQueueCardOverlay,
} from "@/components/photo-to-pdf/PhotoToPdfQueueCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePhotoToPdfWorkspace } from "@/hooks/photo-to-pdf/use-photo-to-pdf-workspace";
import type { PhotoToPdfPageSize } from "@/types/photo-to-pdf/photo-to-pdf.types";
import WorkspaceStat from "@/components/common/WorkspaceStat";

const pageSizeOptions: {
  value: PhotoToPdfPageSize;
  label: string;
}[] = [
  { value: "original", label: "Original" },
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
];

export default function PhotoToPdfCanvas() {
  const {
    activeDragId,
    addFiles,
    canExport,
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
    status,
    updatePageSize,
  } = usePhotoToPdfWorkspace();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const activeItem = items.find((item) => item.id === activeDragId) ?? null;
  const selectedPageSizeLabel =
    pageSizeOptions.find((option) => option.value === pageSize)?.label ??
    "Original";

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

  return (
    <div className="relative min-h-svh overflow-hidden">
      <input
        accept="image/jpeg,.jpg,.jpeg"
        className="sr-only"
        multiple
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
          <Dropzone
            title="Drop JPG photos here"
            description="Or click to upload."
          />
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
                        Photo to PDF
                      </p>
                      <h1 className="font-heading text-3xl leading-none tracking-[-0.04em] text-foreground sm:text-4xl">
                        JPG pages ready to export
                      </h1>
                      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                        Upload JPG photos, choose the PDF page size, reorder the
                        queue, and export everything as one PDF or separate
                        files.
                      </p>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
                      <div className="rounded-[1.35rem] border border-border/60 bg-background/75 p-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
                          Page size
                        </p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="mt-3 w-full justify-between rounded-[1rem] border-border/70 bg-card text-foreground hover:bg-muted/70 aria-expanded:border-primary/40 aria-expanded:bg-accent/70"
                              disabled={
                                status === "loading-files" ||
                                status === "exporting"
                              }
                              type="button"
                              variant="outline"
                            >
                              <span>{selectedPageSizeLabel}</span>
                              <ChevronDown className="size-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            className="rounded-[1rem] border border-border/70 bg-popover/98 p-1.5 shadow-[0_18px_32px_rgb(36_27_21_/_0.12)]"
                          >
                            <DropdownMenuRadioGroup
                              onValueChange={(value) =>
                                void updatePageSize(value as PhotoToPdfPageSize)
                              }
                              value={pageSize}
                            >
                              {pageSizeOptions.map((option) => (
                                <DropdownMenuRadioItem
                                  className="rounded-[0.8rem] px-3 py-2 text-sm text-foreground data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary"
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </DropdownMenuRadioItem>
                              ))}
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <WorkspaceStat label="Photos" value={items.length} />
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-sm p-2 transition-colors hover:border-primary/25 hover:bg-accent/35 w-full max-w-max">
                      <Checkbox
                        checked={exportEachPhoto}
                        className="mt-0.5 size-[1.125rem] rounded-[0.45rem] border-border/80 bg-card data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground"
                        disabled={
                          status === "loading-files" || status === "exporting"
                        }
                        onCheckedChange={(checked) => {
                          setExportEachPhoto(checked === true);
                        }}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Export each photo as separate PDF
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                    <Button
                      className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                      disabled={!canExport}
                      onClick={(event) => {
                        event.stopPropagation();
                        void exportPdf();
                      }}
                      type="button"
                    >
                      <Save className="size-4" />
                      {status === "exporting"
                        ? exportEachPhoto
                          ? "Exporting PDFs..."
                          : "Exporting PDF..."
                        : exportEachPhoto
                          ? "Export PDFs"
                          : "Export PDF"}
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
                      Add JPGs
                    </Button>
                    <Button
                      className="rounded-full px-4"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearItems();
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

              <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-6 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((item) => (
                  <PhotoToPdfQueueCard
                    item={item}
                    key={item.id}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            <DragOverlay dropAnimation={null}>
              {activeItem ? (
                <div className="w-55">
                  <PhotoToPdfQueueCardOverlay item={activeItem} />
                </div>
              ) : null}
            </DragOverlay>
          </DragDropProvider>
        )}
      </div>
    </div>
  );
}
