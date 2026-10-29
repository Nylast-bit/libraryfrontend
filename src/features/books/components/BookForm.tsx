"use client";
import { Input, TextArea } from "@heroui/react";

import { useState, type FormEvent } from "react";
import { getErrorMessage } from "@/shared/api/client";
import { Button } from "@/shared/components/Button";
import { FormField } from "@/shared/components/FormField";
import { toDateInputValue } from "@/shared/utils/format";
import type { Book, BookPayload } from "../types";

interface BookFormProps {
  initial?: Book;
  onSubmit: (payload: BookPayload) => Promise<void>;
  onCancel: () => void;
}

export default function BookForm({ initial, onSubmit, onCancel }: BookFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [pageCount, setPageCount] = useState(String(initial?.pageCount ?? ""));
  const [publishDate, setPublishDate] = useState(toDateInputValue(initial?.publishDate ?? ""));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        excerpt: excerpt.trim() || null,
        pageCount: Number(pageCount),
        publishDate: new Date(publishDate).toISOString(),
      });
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField label="Título" htmlFor="title">
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
      </FormField>

      <FormField label="Descripción" htmlFor="description">
        <TextArea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
      </FormField>

      <FormField label="Fragmento" htmlFor="excerpt">
        <TextArea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} fullWidth />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Páginas" htmlFor="pageCount">
          <Input
            id="pageCount"
            type="number"
            min={1}
            required
            value={pageCount}
            onChange={(e) => setPageCount(e.target.value)}
            fullWidth
          />
        </FormField>
        <FormField label="Fecha de publicación" htmlFor="publishDate">
          <Input
            id="publishDate"
            type="date"
            required
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
            fullWidth
          />
        </FormField>
      </div>

      {error && <p role="alert" className="text-sm text-danger">{error}</p>}

      <div className="mt-2 flex justify-end gap-3">
        <Button variant="secondary" onPress={onCancel} isDisabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" isDisabled={saving}>
          {saving ? "Guardando…" : initial ? "Guardar cambios" : "Agregar libro"}
        </Button>
      </div>
    </form>
  );
}
