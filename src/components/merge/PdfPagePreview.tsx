import { useState } from "react";
import { FileWarning } from "lucide-react";
import { Document, Page } from "react-pdf";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import "@/utils/merge/pdf-preview";

type PdfPagePreviewProps = {
  className?: string;
  file: File | string;
  pageNumber?: number;
  pageWidth: number;
  title: string;
};

export default function PdfPagePreview({
  className,
  file,
  pageNumber = 1,
  pageWidth,
}: PdfPagePreviewProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex min-h-52 flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-border/70 bg-muted/30 px-4 py-6 text-center",
          className,
        )}
      >
        <FileWarning className="size-5 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Preview unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      <Document
        file={file}
        className="flex h-full w-full items-center justify-center"
        loading={<Skeleton className="h-56 w-full rounded-[1rem]" />}
        onLoadError={() => {
          setHasError(true);
        }}
      >
        <Page
          loading={<Skeleton className="h-56 w-full rounded-[1rem]" />}
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={pageWidth}
        />
      </Document>
    </div>
  );
}
