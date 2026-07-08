"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import VariantSelector from "@/components/VariantSelector";
import { getProductById } from "@/lib/products";
import { formatCurrency } from "@/lib/format";
import type { Product, CartItem } from "@/lib/types";

const CART_KEY = "ironworks_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeCart(items: CartItem[]) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductById(id).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    if (product.variants.length > 0 && !variant) {
      alert("Please choose a variant.");
      return;
    }
    const cart = readCart();
    const existing = cart.find((c) => c.productId === product.id && c.variant === variant);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ productId: product.id, name: product.name, variant, price: product.price, qty: 1 });
    }
    writeCart(cart);
    setAdded(true);
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-paper">
      <Header subtitle="PRODUCT — scanned from shelf QR" />
      <div className="p-6">
        <div className="bg-white rounded-lg overflow-hidden mb-5">
          {product.imageUrl ? (
            <div className="w-full bg-paper/60 flex items-center justify-center" style={{ maxHeight: 280 }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full max-h-[280px] object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-[160px] border-b border-dashed border-gray-300 bg-paper/40 flex items-center justify-center">
              <span className="text-xs text-gray-400">No photo added yet</span>
            </div>
          )}
          <div className="p-5">
            <div className="text-xs uppercase text-gray-400">{product.category}</div>
            <div className="font-display font-extrabold text-2xl">{product.name}</div>
            <div className="font-mono text-orangeDark font-semibold text-xl my-2">
              {formatCurrency(product.price)}
            </div>
            <VariantSelector variants={product.variants} selected={variant} onSelect={setVariant} />
            <button
              onClick={handleAddToCart}
              className="bg-orange text-white font-display font-bold uppercase tracking-wide rounded px-4 py-2 hover:bg-orangeDark transition"
            >
              Add to Cart
            </button>
            {added && <p className="text-sm text-green-700 mt-2">Added ✓</p>}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push("/shop")} className="text-sm border border-charcoal rounded px-4 py-2">
            ← Scan another product
          </button>
          <button onClick={() => router.push("/shop/cart")} className="text-sm bg-steel text-white rounded px-4 py-2">
            View Cart →
          </button>
        </div>
      </div>
    </div>
  );
}