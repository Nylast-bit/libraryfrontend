const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con la API. Verifica que el backend esté corriendo.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, `La API respondió con ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) return "No encontramos ese registro.";
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado.";
}
