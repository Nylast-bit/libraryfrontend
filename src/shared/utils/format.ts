export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Sin fecha";

  return date.toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" });
}

/** Convierte una fecha ISO al formato que espera un <input type="date"> (yyyy-mm-dd). */
export function toDateInputValue(isoDate: string): string {
  return isoDate ? isoDate.slice(0, 10) : "";
}

/** FakeRestAPI no guarda los registros nuevos y devuelve id 0; generamos uno local para la UI. */
export function nextLocalId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}
