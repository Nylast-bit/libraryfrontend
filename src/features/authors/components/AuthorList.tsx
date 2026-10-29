"use client";
import { Input } from "@heroui/react";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/shared/api/client";
import { Button } from "@/shared/components/Button";

import { Modal } from "@/shared/components/Modal";
import { PageHeader } from "@/shared/components/PageHeader";
import { StatusMessage } from "@/shared/components/StatusMessage";
import { nextLocalId } from "@/shared/utils/format";
import { authorService } from "../services/authorService";
import type { Author, AuthorPayload } from "../types";

// Lazy loading: el formulario y el diálogo solo se descargan cuando se abren.
const AuthorForm = dynamic(() => import("./AuthorForm"));
const ConfirmDialog = dynamic(() => import("@/shared/components/ConfirmDialog").then((m) => m.ConfirmDialog));

type ModalState = { type: "create" } | { type: "edit"; author: Author } | { type: "delete"; author: Author } | null;

export function AuthorList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    let active = true;
    authorService
      .getAll()
      .then((data) => active && setAuthors(data))
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? authors.filter((a) => a.fullName.toLowerCase().includes(term)) : authors;
  }, [authors, search]);

  const closeModal = () => setModal(null);

  // FakeRestAPI no persiste: actualizamos el estado local con lo que responde la API.
  const handleCreate = async (payload: AuthorPayload) => {
    const created = await authorService.create(payload);
    setAuthors((prev) => [{ ...created, id: nextLocalId(prev) }, ...prev]);
    closeModal();
  };

  const handleUpdate = async (id: number, payload: AuthorPayload) => {
    const updated = await authorService.update(id, payload);
    setAuthors((prev) => prev.map((a) => (a.id === id ? { ...updated, id } : a)));
    closeModal();
  };

  const handleDelete = async (id: number) => {
    try {
      await authorService.remove(id);
      setAuthors((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      closeModal();
    }
  };

  return (
    <section>
      <PageHeader
        title="Autores"
        description="Consulta los autores y cuántos libros han publicado."
        action={<Button onPress={() => setModal({ type: "create" })}>Agregar autor</Button>}
      />

      <Input
        type="search"
        placeholder="Buscar por nombre"
        aria-label="Buscar por nombre"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full sm:w-80"
      />

      {error && <div className="mb-6"><StatusMessage kind="error" message={error} /></div>}

      {loading ? (
        <StatusMessage kind="loading" message="Cargando autores…" />
      ) : filtered.length === 0 ? (
        <StatusMessage kind="empty" message={search ? "Ningún autor coincide con la búsqueda." : "Aún no hay autores. Agrega el primero."} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th scope="col" className="py-3 pr-4 font-medium">Nombre</th>
                <th scope="col" className="py-3 pr-4 text-right font-medium">Libros publicados</th>
                <th scope="col" className="py-3"><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((author) => (
                <tr key={author.id}>
                  <td className="py-4 pr-4 font-medium text-foreground">{author.fullName}</td>
                  <td className="py-4 pr-4 text-right tabular-nums text-foreground">{author.numberOfBooks}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onPress={() => setModal({ type: "edit", author })}>
                        Editar
                      </Button>
                      <Button variant="danger-soft" onPress={() => setModal({ type: "delete", author })}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal?.type === "create" && (
        <Modal title="Agregar autor" onClose={closeModal}>
          <AuthorForm onSubmit={handleCreate} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Editar autor" onClose={closeModal}>
          <AuthorForm initial={modal.author} onSubmit={(p) => handleUpdate(modal.author.id, p)} onCancel={closeModal} />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <ConfirmDialog
          title="Eliminar autor"
          message={`¿Eliminar a ${modal.author.fullName}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar autor"
          onConfirm={() => handleDelete(modal.author.id)}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
