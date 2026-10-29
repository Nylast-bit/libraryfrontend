"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getErrorMessage } from "@/shared/api/client";
import { StatusMessage } from "@/shared/components/StatusMessage";
import { formatDate } from "@/shared/utils/format";
import { bookService } from "../services/bookService";
import type { BookDetail } from "../types";

export function BookDetailView() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    bookService
      .getById(Number(id))
      .then((data) => active && setBook(data))
      .catch((err) => active && setError(getErrorMessage(err)));
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <article>
      <Link href="/books" className="text-sm font-medium text-accent hover:underline">
        Volver a libros
      </Link>

      <div className="mt-6">
        {error ? (
          <StatusMessage kind="error" message={error} />
        ) : !book ? (
          <StatusMessage kind="loading" message="Cargando libro…" />
        ) : (
          <>
            <h1 className="font-display text-4xl font-semibold text-foreground">{book.title}</h1>
            <p className="mt-2 text-muted">
              Publicado el {formatDate(book.publishDate)}, {book.pageCount} páginas
            </p>

            <div className="mt-8 grid gap-10 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <section>
                  <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Descripción</h2>
                  <p className="leading-relaxed text-foreground/90">{book.description ?? "Sin descripción."}</p>
                </section>
                {book.excerpt && (
                  <section>
                    <h2 className="mb-2 font-display text-lg font-semibold text-foreground">Fragmento</h2>
                    <blockquote className="border-l-2 border-accent pl-4 leading-relaxed text-muted italic">
                      {book.excerpt}
                    </blockquote>
                  </section>
                )}
              </div>

              <aside>
                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                  {book.authors.length === 1 ? "Autor" : "Autores"}
                </h2>
                {book.authors.length === 0 ? (
                  <p className="text-muted">Este libro no tiene autores registrados.</p>
                ) : (
                  <ul className="space-y-2">
                    {book.authors.map((author) => (
                      <li key={author.id} className="rounded-md bg-default px-3 py-2 text-foreground">
                        {author.fullName}
                      </li>
                    ))}
                  </ul>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
