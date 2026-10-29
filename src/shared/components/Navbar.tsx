import Link from "next/link";

const links = [
  { href: "/books", label: "Libros" },
  { href: "/authors", label: "Autores" },
];

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/books" className="font-display text-xl font-semibold text-foreground">
          Biblioteca
        </Link>
        <ul className="flex gap-6 text-sm font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-muted transition-colors hover:text-foreground">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
