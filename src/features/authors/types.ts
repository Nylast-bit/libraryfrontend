export interface Author {
  id: number;
  bookId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  numberOfBooks: number;
}

/** Lo que se envía al crear o editar un autor. */
export type AuthorPayload = Pick<Author, "bookId" | "firstName" | "lastName">;
