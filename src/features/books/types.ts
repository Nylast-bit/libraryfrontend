export interface Book {
  id: number;
  title: string;
  description: string | null;
  pageCount: number;
  excerpt: string | null;
  publishDate: string;
}

export interface BookAuthor {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface BookDetail extends Book {
  authors: BookAuthor[];
}

/** Lo que se envía al crear o editar: igual que Book pero sin id. */
export type BookPayload = Omit<Book, "id">;
