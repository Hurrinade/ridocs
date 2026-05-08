import { useSortable } from "@dnd-kit/react/sortable";
import { Trash2 } from "lucide-react";
import PdfPagePreview from "@/components/merge/PdfPagePreview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PhotoToPdfItem } from "@/types/photo-to-pdf/photo-to-pdf.types";

type PhotoToPdfQueueCardProps = {
  item: PhotoToPdfItem;
  onRemove?: (itemId: string) => void;
  isOverlay?: boolean;
};

function PhotoToPdfQueueCardBody({
  item,
  onRemove,
  isOverlay = false,
}: PhotoToPdfQueueCardProps) {
  return (
    <div
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-[1.5rem] border border-border/75 bg-card/92 text-left transition-colors",
        "hover:border-foreground/40 hover:bg-card",
        isOverlay && "shadow-[0_22px_48px_rgb(28_20_13_/_0.16)]",
      )}
    >
      {!isOverlay ? (
        <Button
          className="absolute top-2 right-2 z-10 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.(item.id);
          }}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Remove {item.fileName}</span>
        </Button>
      ) : null}

      <div className="flex flex-col items-center justify-between px-4 py-2 h-full">
        <PdfPagePreview
          file={item.previewUrl}
          title={item.fileName}
          pageWidth={130}
          className="h-[180px] w-[130px]"
        />

        <div className="mt-1 flex w-full items-start justify-between">
          <div className="min-w-0 text-center">
            <p className="line-clamp-2 text-xs text-foreground text-center">
              {item.fileName}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.width} x {item.height}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhotoToPdfQueueCardOverlay({
  item,
}: Pick<PhotoToPdfQueueCardProps, "item">) {
  return <PhotoToPdfQueueCardBody isOverlay item={item} />;
}

export default function PhotoToPdfQueueCard({
  item,
  onRemove,
}: PhotoToPdfQueueCardProps) {
  const { isDragSource, isDropTarget, ref } = useSortable({
    id: item.id,
    index: item.order - 1,
    group: "photo-to-pdf-queue",
  });

  return (
    <div
      className={cn(
        "rounded-[1.5rem] w-[200px] h-[250px]",
        isDragSource && "opacity-60",
        isDropTarget &&
          "ring-2 ring-foreground/30 ring-offset-2 ring-offset-background",
      )}
      ref={ref}
    >
      <PhotoToPdfQueueCardBody item={item} onRemove={onRemove} />
    </div>
  );
}
