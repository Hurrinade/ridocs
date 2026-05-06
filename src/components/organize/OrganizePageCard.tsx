import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, Trash2 } from "lucide-react";
import PdfPagePreview from "@/components/merge/PdfPagePreview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PdfOrganizePageItem } from "@/types/organize/organize.types";

type OrganizePageCardProps = {
  file: string;
  item: PdfOrganizePageItem;
  isOverlay?: boolean;
  onRemove?: (itemId: string) => void;
};

function OrganizePageCardBody({
  file,
  item,
  isOverlay = false,
  onRemove,
}: OrganizePageCardProps) {
  const pageLabel = item.sourcePageIndex + 1;

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-border/75 bg-card/92 text-left  transition-colors h-[400px]",
        "hover:border-foreground/40 hover:bg-card",
        isOverlay && "shadow-[0_24px_56px_rgb(36_27_21_/_0.14)]",
      )}
    >
      {!isOverlay ? (
        <Button
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100"
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
          <span className="sr-only">Delete page {pageLabel}</span>
        </Button>
      ) : null}

      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          <GripVertical className="size-3.5" />
          Source page {pageLabel}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pt-3 pb-4">
        <PdfPagePreview
          className="min-h-0 flex-1"
          file={file}
          pageNumber={pageLabel}
          pageWidth={180}
          title={`Page ${pageLabel}`}
        />
      </div>
    </div>
  );
}

export function OrganizePageCardOverlay({
  file,
  item,
}: Pick<OrganizePageCardProps, "file" | "item">) {
  return <OrganizePageCardBody file={file} isOverlay item={item} />;
}

export default function OrganizePageCard({
  file,
  item,
  onRemove,
}: OrganizePageCardProps) {
  const { isDragSource, isDropTarget, ref } = useSortable({
    id: item.id,
    index: item.order - 1,
    group: "pdf-organize-pages",
  });

  return (
    <div
      className={cn(
        "h-full rounded-[1.6rem]",
        isDragSource && "opacity-60",
        isDropTarget &&
          "ring-2 ring-foreground/30 ring-offset-2 ring-offset-background",
      )}
      ref={ref}
    >
      <OrganizePageCardBody file={file} item={item} onRemove={onRemove} />
    </div>
  );
}
