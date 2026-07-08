"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import CartLine from "@/components/CartLine";
import QRCode from "@/components/QRCode";
import { createCart } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/lib/types";

const CART_KEY = "ironworks_cart";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      setItems(JSON.parse(sessionStorage.getItem(CART_KEY) || "[]"));
    } catch {
      setItems([]);
    }
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function handleCheckout() {
    if (items.length === 0) return;
    setSubmitting(true);
    const id = await createCart(items);
    sessionStorage.removeItem(CART_KEY);
    setCartId(id);
    setItems([]);
    setSubmitting(false);
  }

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-paper">
      <Header subtitle="CART — review before checkout" />
      <div className="p-6">
        <div className="bg-charcoal text-white rounded-lg p-5 mb-5">
          <h3 className="font-display uppercase text-orange text-lg mb-2">Cart</h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Cart is empty.</p>
          ) : (
            items.map((i, idx) => <CartLine key={idx} item={i} />)
          )}
          {items.length > 0 && (
            <div className="flex justify-between font-mono text-lg font-semibold pt-3 mt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="bg-orange text-white font-display font-bold uppercase tracking-wide rounded px-5 py-3 w-full hover:bg-orangeDark transition"
          >
            {submitting ? "Generating…" : "Generate Cart ID (done shopping)"}
          </button>
        )}

        {cartId && (
          <div className="bg-white rounded-lg p-6 text-center mt-5 border-t-4 border-dashed border-gray-300">
            <div className="text-xs uppercase text-gray-500 mb-2">Show this at the billing counter</div>
            <div className="font-mono text-3xl font-bold tracking-widest bg-amber-50 border-2 border-dashed border-amber-400 rounded px-5 py-3 inline-block mb-3">
              {cartId}
            </div>
            <div className="flex justify-center">
              <QRCode value={cartId} size={100} />
            </div>
          </div>
        )}

        <button onClick={() => router.push("/shop")} className="text-sm text-steel mt-5 underline">
          ← Continue shopping
        </button>
      </div>
    </div>
  );
}
