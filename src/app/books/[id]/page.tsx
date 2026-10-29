import { Suspense } from "react";
import { BookDetailView } from "@/features/books/components/BookDetailView";
import { StatusMessage } from "@/shared/components/StatusMessage";

export default function BookDetailPage() {
  return (
    <Suspense fallback={<StatusMessage kind="loading" message="Cargando libro…" />}>
      <BookDetailView />
    </Suspense>
  );
}
