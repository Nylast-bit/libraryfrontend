"use client";

import { useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose }: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-6 text-muted">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onPress={onClose} isDisabled={busy}>
          Cancelar
        </Button>
        <Button variant="danger" onPress={handleConfirm} isPending={busy}>
          {busy ? "Eliminando…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
