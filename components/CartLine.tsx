import type { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export default function CartLine({ item }: { item: CartItem }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b border-gray-700/40">
      <span>
        {item.name}
        {item.variant && <span className="font-mono text-xs text-gray-400"> ({item.variant})</span>}
      </span>
      <span className="font-mono">
        ×{item.qty} — {formatCurrency(item.price * item.qty)}
      </span>
    </div>
  );
}
