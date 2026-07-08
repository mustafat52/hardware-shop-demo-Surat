export default function StatusBadge({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`mt-4 px-4 py-3 rounded text-sm border ${
        ok
          ? "bg-green-50 text-green-700 border-green-300"
          : "bg-red-50 text-red-700 border-red-300"
      }`}
    >
      {children}
    </div>
  );
}
