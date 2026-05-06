import { FileUp } from "lucide-react";

export default function Dropzone({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-[1.4rem] border border-foreground/15 bg-foreground/10 text-foreground">
        <FileUp className="size-7" />
      </div>
      <div className="space-y-2">
        <p className="font-heading text-[1.9rem] tracking-[-0.03em] text-foreground">
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
