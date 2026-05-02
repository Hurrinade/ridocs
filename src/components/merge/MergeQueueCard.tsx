import { useSortable } from "@dnd-kit/react/sortable";
import { Trash2 } from "lucide-react";
import PdfPagePreview from "@/components/merge/PdfPagePreview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PdfMergeItem } from "@/types/merge/merge.types";

type MergeQueueCardProps = {
  item: PdfMergeItem;
  isOverlay?: boolean;
  isSelected?: boolean;
  onOpen?: (item: PdfMergeItem) => void;
  onRemove?: (itemId: string) => void;
};

function MergeQueueCardBody({
  item,
  isOverlay = false,
  isSelected = false,
  onOpen,
  onRemove,
}: MergeQueueCardProps) {
  function handleOpen() {
    onOpen?.(item);
  }

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-border/75 bg-card/92 text-left  transition-colors h-[300px]",
        "hover:border-foreground/40 hover:bg-card",
        isSelected && "border-foreground/50 bg-foreground/6",
        isOverlay && "shadow-[0_22px_48px_rgb(28_20_13_/_0.16)]",
      )}
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {!isOverlay ? (
        <Button
          className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
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

      <div className="flex flex-1 flex-col items-center pb-2 h-full">
        <PdfPagePreview
          className="min-h-0 flex-1 p-2"
          file={item.previewUrl}
          pageWidth={180}
          title={item.fileName}
        />

        <p
          className={cn(
            "mt-1 line-clamp-2 text-sm font-medium leading-5 text-foreground",
            isOverlay && "line-clamp-1",
          )}
        >
          {item.fileName}
        </p>
      </div>
    </div>
  );
}

export function MergeQueueCardOverlay({
  item,
}: Pick<MergeQueueCardProps, "item">) {
  return <MergeQueueCardBody isOverlay item={item} />;
}

export default function MergeQueueCard({
  item,
  isSelected = false,
  onOpen,
  onRemove,
}: MergeQueueCardProps) {
  const { isDragSource, isDropTarget, ref } = useSortable({
    id: item.id,
    index: item.order - 1,
    group: "pdf-merge-queue",
  });

  return (
    <div
      className={cn(
        "rounded-[1.5rem]",
        isDragSource && "opacity-60",
        isDropTarget &&
          "ring-2 ring-foreground/30 ring-offset-2 ring-offset-background",
      )}
      ref={ref}
    >
      <MergeQueueCardBody
        isSelected={isSelected}
        item={item}
        onOpen={onOpen}
        onRemove={onRemove}
      />
    </div>
  );
}
