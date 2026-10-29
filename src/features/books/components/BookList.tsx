"use client";
import { buttonVariants, Input } from "@heroui/react";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/shared/api/client";
import { Button } from "@/shared/components/Button";

import { Modal } from "@/shared/components/Modal";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusMessage } from "@/shared/components/StatusMessage";
import { nextLocalId } from "@/shared/utils/format";
import { bookService } from "../services/bookService";
import type { Book, BookPayload } from "../types";

// Lazy loading: el formulario y el diálogo solo se descargan cuando se abren.
const BookForm = dynamic(() => import("./BookForm"));
const ConfirmDialog = dynamic(() => import("@/shared/components/ConfirmDialog").then((m) => m.ConfirmDialog));

type ModalState = { type: "create" } | { type: "edit"; book: Book } | { type: "delete"; book: Book } | null;

export function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    let active = true;
    bookService
      .getAll()
      .then((data) => active && setBooks(data))
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? books.filter((b) => b.title.toLowerCase().includes(term)) : books;
  }, [books, search]);

  const closeModal = () => setModal(null);

  // FakeRestAPI no persiste: actualizamos el estado local con lo que responde la API.
  const handleCreate = async (payload: BookPayload) => {
    const created = await bookService.create(payload);
    setBooks((prev) => [{ ...created, id: nextLocalId(prev) }, ...prev]);
    closeModal();
  };

  const handleUpdate = async (id: number, payload: BookPayload) => {
    const updated = await bookService.update(id, payload);
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...updated, id } : b)));
    closeModal();
  };

  const handleDelete = async (id: number) => {
    try {
      await bookService.remove(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      closeModal();
    } catch (err) {
      setError(getErrorMessage(err));
      closeModal();
    }
  };

  return (
    <section>
      <PageHeader
        title="Libros"
        description="Consulta, agrega y edita los libros del catálogo."
        action={<Button onPress={() => setModal({ type: "create" })}>Agregar libro</Button>}
      />

      <Input
        type="search"
        placeholder="Buscar por título"
        aria-label="Buscar por título"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full sm:w-80"
      />

      {error && <div className="mb-6"><StatusMessage kind="error" message={error} /></div>}

      {loading ? (
        <StatusMessage kind="loading" message="Cargando libros…" />
      ) : filtered.length === 0 ? (
        <StatusMessage kind="empty" message={search ? "Ningún libro coincide con la búsqueda." : "Aún no hay libros. Agrega el primero."} />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filtered.map((book) => (
            <li key={book.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 max-w-2xl">
                <h2 className="font-display text-lg font-semibold text-foreground">{book.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{book.description ?? "Sin descripción."}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/books/${book.id}`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Ver detalle
                </Link>
                <Button variant="secondary" onPress={() => setModal({ type: "edit", book })}>
                  Editar
                </Button>
                <Button variant="danger-soft" onPress={() => setModal({ type: "delete", book })}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal?.type === "create" && (
        <Modal title="Agregar libro" onClose={closeModal}>
          <BookForm onSubmit={handleCreate} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Editar libro" onClose={closeModal}>
          <BookForm initial={modal.book} onSubmit={(p) => handleUpdate(modal.book.id, p)} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <ConfirmDialog
          title="Eliminar libro"
          message={`¿Eliminar "${modal.book.title}"? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar libro"
          onConfirm={() => handleDelete(modal.book.id)}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
