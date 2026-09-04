export type PdfPageSize = "original" | "a4" | "letter";

export type PdfPageQuarterTurn = 0 | 90 | 180 | 270;

export type WorkspaceStatProps = {
  label: string;
  value: string | number;
  className?: string;
};

export type PdfPageSizeSelectProps = {
  value: PdfPageSize;
  onChange: (value: PdfPageSize) => void;
  disabled?: boolean;
  className?: string;
};
