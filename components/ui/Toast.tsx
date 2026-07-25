import { CheckCircle2, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
}

export function Toast({ message, type = "success" }: ToastProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-md border bg-white px-5 py-4 shadow-2xl ${type === "success" ? "border-emerald-100" : "border-red-100"}`}
    >
      <div className="flex items-center gap-3 text-sm text-slate-800">
        {type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
