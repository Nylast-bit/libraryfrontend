"use client";
import { Input } from "@heroui/react";

import { useState, type FormEvent } from "react";
import { getErrorMessage } from "@/shared/api/client";
import { Button } from "@/shared/components/Button";
import { FormField } from "@/shared/components/FormField";
import type { Author, AuthorPayload } from "../types";

interface AuthorFormProps {
  initial?: Author;
  onSubmit: (payload: AuthorPayload) => Promise<void>;
  onCancel: () => void;
}

export default function AuthorForm({ initial, onSubmit, onCancel }: AuthorFormProps) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [bookId, setBookId] = useState(String(initial?.bookId ?? ""));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), bookId: Number(bookId) });
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nombre" htmlFor="firstName">
          <Input id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
        </FormField>
        <FormField label="Apellido" htmlFor="lastName">
          <Input id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
        </FormField>
      </div>

      <FormField label="ID del libro" htmlFor="bookId">
        <Input
          id="bookId"
          type="number"
          min={1}
          required
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          fullWidth
        />
      </FormField>

      {error && <p role="alert" className="text-sm text-danger">{error}</p>}

      <div className="mt-2 flex justify-end gap-3">
        <Button variant="secondary" onPress={onCancel} isDisabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" isDisabled={saving}>
          {saving ? "Guardando…" : initial ? "Guardar cambios" : "Agregar autor"}
        </Button>
      </div>
    </form>
  );
}
