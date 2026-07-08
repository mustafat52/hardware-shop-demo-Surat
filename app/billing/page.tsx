"use client";
import { useState } from "react";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import { getCartById, markCartPaid } from "@/lib/cart";
import { formatCurrency } from "@/lib/format";
import type { Cart } from "@/lib/types";

export default function BillingPage() {
  const [input, setInput] = useState("");
  const [cart, setCart] = useState<Cart | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLookup() {
    const id = input.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    const result = await getCartById(id);
    setCart(result);
    setNotFound(!result);
    setLoading(false);
  }

  async function handleConfirmPayment() {
    if (!cart) return;
    await markCartPaid(cart.id);
    setCart({ ...cart, paid: true, paidAt: Date.now() });
  }

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-paper">
      <Header subtitle="BILLING COUNTER — look up Cart ID, confirm payment" />
      <div className="p-6">
        <div className="flex gap-3 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            placeholder="ENTER CART ID e.g. CART-4821"
            className="flex-1 border border-gray-300 rounded px-4 py-3 font-mono text-lg uppercase tracking-wide"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="bg-steel text-white font-display font-bold uppercase rounded px-5 py-3"
          >
            {loading ? "…" : "Look Up"}
          </button>
        </div>

        {notFound && (
          <StatusBadge ok={false}>
            ✕ No cart found for &quot;{input}&quot;. Ask the customer to check the code shown after checkout.
          </StatusBadge>
        )}

        {cart && (
          <div className="bg-white rounded-lg p-5">
            <div className="flex justify-between items-baseline border-b-2 border-charcoal pb-2 mb-2">
              <h3 className="font-display uppercase text-xl">Bill — {cart.id}</h3>
              <span className="font-mono text-xs text-gray-400">{cart.items.length} item(s)</span>
            </div>
            {cart.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-sm py-2 border-b border-dotted border-gray-300">
                <span>
                  {it.name}
                  {it.variant && <span className="text-xs text-gray-400"> ({it.variant})</span>}
                </span>
                <span className="font-mono">×{it.qty} — {formatCurrency(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between font-mono text-xl font-semibold pt-3 mt-2 border-t-2 border-charcoal">
              <span>Total Due</span>
              <span>{formatCurrency(cart.total)}</span>
            </div>

            {cart.paid ? (
              <StatusBadge ok={true}>✓ Payment already completed for this cart.</StatusBadge>
            ) : (
              <button
                onClick={handleConfirmPayment}
                className="bg-orange text-white font-display font-bold uppercase rounded px-5 py-3 w-full mt-4 hover:bg-orangeDark transition"
              >
                Confirm Payment &amp; Complete Sale
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
