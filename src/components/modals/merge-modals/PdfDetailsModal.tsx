import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import PdfPagePreview from "@/components/merge/PdfPagePreview";
import type { PdfDetailsModalPayload } from "@/types";
import { formatFileSize } from "@/utils/merge/pdf-merge";

type PdfDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: PdfDetailsModalPayload;
};

export default function PdfDetailsModal({
  open,
  onOpenChange,
  payload,
}: PdfDetailsModalProps) {
  const { item, onRemove } = payload;

  function handleRemove() {
    onRemove?.(item.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-4xl gap-0 overflow-hidden !p-0">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="bg-card p-5 h-full">
            <PdfPagePreview
              className="bg-[#f6eddc]"
              file={item.previewUrl}
              pageWidth={550}
              title={item.fileName}
            />
          </div>

          <div className="border-t border-border bg-background/70 px-5 py-5 sm:px-6 md:border-t-0 md:border-l">
            <div className="space-y-5">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Name
                </p>
                <p className="break-words font-medium text-foreground">
                  {item.fileName}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Pages
                </p>
                <p className="font-medium text-foreground">{item.pageCount}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Size
                </p>
                <p className="font-medium text-foreground">
                  {formatFileSize(item.fileSize)}
                </p>
              </div>
            </div>

            <DialogFooter className="mt-8 sm:flex-col sm:items-stretch sm:justify-start">
              {onRemove ? (
                <Button onClick={handleRemove} type="button" variant="outline">
                  Remove PDF
                </Button>
              ) : null}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
