"use client";

import { Modal as HeroModal } from "@heroui/react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Modal controlado: se monta abierto y avisa con onClose al cerrarse (Escape, clic fuera o botón). */
export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <HeroModal.Backdrop isOpen onOpenChange={(open) => !open && onClose()}>
      <HeroModal.Container>
        <HeroModal.Dialog>
          <HeroModal.Header>
            <HeroModal.Heading className="font-display text-xl">{title}</HeroModal.Heading>
          </HeroModal.Header>
          <HeroModal.Body>{children}</HeroModal.Body>
        </HeroModal.Dialog>
      </HeroModal.Container>
    </HeroModal.Backdrop>
  );
}
