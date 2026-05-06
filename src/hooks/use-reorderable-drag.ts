import { useState } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

type UseReorderableDragOptions = {
  onReorder: (sourceIndex: number, targetIndex: number) => void;
};

export function useReorderableDrag({ onReorder }: UseReorderableDragOptions) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  function startDrag(itemId: string | null) {
    setActiveDragId(itemId);
  }

  function endDrag() {
    setActiveDragId(null);
  }

  function reorderItems(sourceIndex: number, targetIndex: number) {
    onReorder(sourceIndex, targetIndex);
  }

  function handleDragStart(event: DragStartEvent) {
    startDrag(
      event.operation.source?.id ? String(event.operation.source.id) : null,
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { source } = event.operation;

    endDrag();

    if (event.canceled || !isSortable(source)) {
      return;
    }

    const { initialIndex, index } = source;

    if (initialIndex !== index) {
      reorderItems(initialIndex, index);
    }
  }

  return {
    activeDragId,
    endDrag,
    handleDragEnd,
    handleDragStart,
    reorderItems,
    startDrag,
  };
}
