import { apiFetch } from "@/shared/api/client";
import type { Book, BookDetail, BookPayload } from "../types";

const BASE = "/api/books";

export const bookService = {
  getAll: () => apiFetch<Book[]>(BASE),

  getById: (id: number) => apiFetch<BookDetail>(`${BASE}/${id}`),

  create: (payload: BookPayload) =>
    apiFetch<Book>(BASE, { method: "POST", body: JSON.stringify(payload) }),

  update: (id: number, payload: BookPayload) =>
    apiFetch<Book>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  remove: (id: number) => apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
};
