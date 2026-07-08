"use client";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import QRCode from "./QRCode";

export default function ProductTag({ product, baseUrl }: { product: Product; baseUrl: string }) {
  const scanUrl = `${baseUrl}/shop/product/${product.id}`;

  return (
    <div className="relative bg-white border-2 border-dashed border-gray-300 rounded p-4">
      <div className="absolute -top-2 left-4 w-3 h-3 bg-charcoal rounded-full ring-4 ring-paper" />
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">{product.category}</div>
          <div className="font-display font-bold text-lg leading-tight">{product.name}</div>
          <div className="font-mono font-semibold text-orangeDark text-lg mt-1">
            {formatCurrency(product.price)}
          </div>
          {product.variants.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Variants: {product.variants.join(" · ")}
            </div>
          )}
        </div>
        <QRCode value={scanUrl} size={64} />
      </div>
    </div>
  );
}
