"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { subscribeToProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ShopCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsub = subscribeToProducts(setProducts);
    return () => unsub();
  }, []);

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-paper">
      <Header subtitle="SHOP — browse (normally you'd arrive here by scanning a QR near a product)" />
      <div className="p-6 grid gap-3">
        {products.map((p) => (
          <Link key={p.id} href={`/shop/product/${p.id}`}
            className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between items-center hover:border-steel transition">
            <div>
              <div className="text-xs uppercase text-gray-400">{p.category}</div>
              <div className="font-display font-bold text-lg">{p.name}</div>
            </div>
            <div className="font-mono text-orangeDark font-semibold">{formatCurrency(p.price)}</div>
          </Link>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-gray-500">No products yet — add some in the Owner Panel first.</p>
        )}
      </div>
    </div>
  );
}
