"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetResultsButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    if (disabled || loading) return;

    const confirmed = window.confirm(
      "සියලු ප්‍රතිඵල යළි සැකසීමට අවශ්‍යද? මෙය ඉවත් කළ නොහැක.",
    );
    if (!confirmed) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/submissions", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "යළි සැකසීම අසාර්ථක විය.");
        return;
      }
      router.refresh();
    } catch {
      setError("සේවාදායකය වෙත සම්බන්ධ විය නොහැක.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleReset}
        disabled={disabled || loading}
        className="inline-flex min-h-12 justify-center rounded-2xl border-2 border-coral/40 bg-coral/10 px-5 py-3 text-sm font-bold text-coral transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "යළි සකසමින්..." : "ප්‍රතිඵල යළි සකසන්න"}
      </button>
      {error && <p className="text-sm font-medium text-coral">{error}</p>}
    </div>
  );
}
