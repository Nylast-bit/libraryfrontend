import { apiFetch } from "@/shared/api/client";
import type { Author, AuthorPayload } from "../types";

const BASE = "/api/authors";

export const authorService = {
  getAll: () => apiFetch<Author[]>(BASE),

  getById: (id: number) => apiFetch<Author>(`${BASE}/${id}`),

  create: (payload: AuthorPayload) =>
    apiFetch<Author>(BASE, { method: "POST", body: JSON.stringify(payload) }),

  update: (id: number, payload: AuthorPayload) =>
    apiFetch<Author>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  remove: (id: number) => apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
};
