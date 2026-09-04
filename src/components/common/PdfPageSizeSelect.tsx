import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  PdfPageSize,
  PdfPageSizeSelectProps,
} from "@/types/common/common.type";

const pageSizeOptions: {
  value: PdfPageSize;
  label: string;
}[] = [
  { value: "original", label: "Original" },
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" },
];

export default function PdfPageSizeSelect({
  className,
  disabled,
  onChange,
  value,
}: PdfPageSizeSelectProps) {
  const selectedLabel =
    pageSizeOptions.find((option) => option.value === value)?.label ??
    "Original";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn(
            "w-full justify-between rounded-[1rem] border-border/70 bg-card text-foreground hover:bg-muted/70 aria-expanded:border-primary/40 aria-expanded:bg-accent/70",
            className,
          )}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
          }}
          type="button"
          variant="outline"
        >
          <span>{selectedLabel}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="rounded-[1rem] border border-border/70 bg-popover/98 p-1.5 shadow-[0_18px_32px_rgb(36_27_21_/_0.12)]"
      >
        <DropdownMenuRadioGroup
          onValueChange={(nextValue) => {
            onChange(nextValue as PdfPageSize);
          }}
          value={value}
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
  );
}
