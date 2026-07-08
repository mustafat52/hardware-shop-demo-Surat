"use client";

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: string[];
  selected: string | null;
  onSelect: (v: string) => void;
}) {
  if (variants.length === 0) return null;

  return (
    <div className="mb-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Choose variant</div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={`border rounded px-3 py-1.5 text-sm transition ${
              selected === v
                ? "border-orange bg-orange/10 text-orangeDark font-semibold"
                : "border-gray-300 bg-white hover:border-steel"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
