import { Spinner } from "@heroui/react";

interface StatusMessageProps {
  kind: "loading" | "error" | "empty";
  message: string;
}

const styles = {
  loading: "text-muted",
  error: "border-danger/30 bg-danger/5 text-danger",
  empty: "text-muted",
};

export function StatusMessage({ kind, message }: StatusMessageProps) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={`flex items-center justify-center gap-3 rounded-lg border border-border px-4 py-6 ${styles[kind]}`}
    >
      {kind === "loading" && <Spinner size="sm" />}
      <span>{message}</span>
    </div>
  );
}
