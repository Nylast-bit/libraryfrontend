# Biblioteca: frontend

Aplicación web en **Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + HeroUI v3** que consume la API .NET del repositorio backend para gestionar libros y autores.

## Requisitos

- Node.js 20 o superior
- La API backend corriendo localmente (ver su README)

## Instalación

```bash
git clone <url-de-este-repo>
cd libraryfrontend
npm install
```

Crea un archivo `.env.local` en la raíz con la URL **http** de la API (el puerto aparece en la consola al ejecutar el backend):

```
NEXT_PUBLIC_API_URL=http://localhost:5053
```

Ejecuta en modo desarrollo:

```bash
npm run dev
```

Abre http://localhost:3000.

> Si `npm install` falla con `EALLOWSCRIPTS` en versiones recientes de npm, revisa que no tengas `allow-scripts` en tu `.npmrc` de usuario y aprueba los scripts pendientes con `npm approve-scripts --allow-scripts-pending`.

## Estructura

```
src/
├── app/                     Rutas (páginas delgadas que solo componen features)
│   ├── books/page.tsx       /books
│   ├── books/[id]/page.tsx  /books/:id
│   └── authors/page.tsx     /authors
├── features/
│   ├── books/               Módulo de libros: components, services, types
│   └── authors/             Módulo de autores: components, services, types
└── shared/                  Reutilizable: cliente HTTP, componentes UI, utilidades
```

Cada módulo (`books`, `authors`) contiene sus propios tipos, su servicio de acceso a la API y sus componentes. `shared` no depende de ningún módulo.

## Decisiones técnicas

- **Lazy loading:** el App Router divide el código por ruta, por lo que cada página se descarga solo al visitarla. Además, los formularios y el diálogo de confirmación se cargan con `next/dynamic` únicamente cuando el usuario los abre.
- **UI con HeroUI:** los componentes de HeroUI (Button, Modal, Input, TextArea, Label, Spinner) se usan a través de envoltorios en `shared/components`, así que los módulos de libros y autores no dependen directamente de la librería y cambiarla solo afectaría a `shared`.
- **Capa de servicios:** las páginas nunca llaman a `fetch` directamente. `shared/api/client.ts` centraliza la URL base, los headers y el manejo de errores, y cada módulo expone su servicio (`bookService`, `authorService`).
- **Estado local tras escribir:** FakeRestAPI responde a POST, PUT y DELETE pero no persiste los cambios. Por eso, tras una operación exitosa, la UI actualiza su estado local con la respuesta en lugar de volver a pedir la lista. Los registros nuevos reciben un id local, ya que la API devuelve `0`; su página de detalle no existe en la API.
- **Tipos espejo de los DTOs:** `types.ts` de cada módulo replica los DTOs del backend (`BookResponse`, `BookDetailResponse`, `AuthorResponse`).
