import type { PdfMergeItem } from "@/types/merge/merge.types";

export type ConfirmVariant = "danger" | "primary" | "secondary";

export type ConfirmModalPayload = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export type PdfDetailsModalPayload = {
  item: PdfMergeItem;
  onRemove?: (itemId: string) => void;
};

export type ModalPayloadMap = {
  confirm: ConfirmModalPayload;
  pdfDetails: PdfDetailsModalPayload;
};

export type ModalKey = keyof ModalPayloadMap;

export type ActiveModal = {
  [K in ModalKey]: {
    key: K;
    payload: ModalPayloadMap[K];
  };
}[ModalKey];
