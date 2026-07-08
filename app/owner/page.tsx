"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProductTag from "@/components/ProductTag";
import { subscribeToProducts, addProduct } from "@/lib/products";
import { seedProductsIfEmpty } from "@/data/seed-products";
import type { Product } from "@/lib/types";

export default function OwnerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [baseUrl, setBaseUrl] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [variants, setVariants] = useState("");
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    const unsub = subscribeToProducts(setProducts);
    return () => unsub();
  }, []);

  async function handleAdd() {
    if (!name.trim() || !price) {
      alert("Enter at least a product name and price.");
      return;
    }
    await addProduct({
      name: name.trim(),
      category: category.trim() || "General",
      price: Number(price),
      variants: variants.split(",").map((v) => v.trim()).filter(Boolean),
    });
    setName(""); setCategory(""); setPrice(""); setVariants("");
  }

  async function handleSeed() {
    setSeeding(true);
    await seedProductsIfEmpty();
    setSeeding(false);
  }

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-paper">
      <Header subtitle="OWNER PANEL — catalog & QR tags" />
      <div className="p-6">
        {products.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="mb-4 text-sm border border-charcoal rounded px-3 py-2 hover:bg-charcoal hover:text-white transition"
          >
            {seeding ? "Seeding…" : "Load sample catalog (one-time)"}
          </button>
        )}

        <div className="bg-white rounded-lg p-4 border border-gray-200 grid grid-cols-2 gap-3 mb-6">
          <div className="col-span-2">
            <label className="text-[11px] uppercase text-gray-500 block mb-1">Product name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cordless Drill 18V"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[11px] uppercase text-gray-500 block mb-1">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Power Tools"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[11px] uppercase text-gray-500 block mb-1">Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 3499"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] uppercase text-gray-500 block mb-1">Variants (comma separated, optional)</label>
            <input value={variants} onChange={(e) => setVariants(e.target.value)} placeholder="e.g. Standard, With Battery"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <button onClick={handleAdd}
              className="bg-orange text-white font-display font-bold uppercase tracking-wide rounded px-4 py-2 hover:bg-orangeDark transition">
              + Add Product &amp; Generate QR
            </button>
          </div>
        </div>

        <h2 className="font-display font-bold text-xl uppercase mb-3">
          Catalog ({products.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {baseUrl && products.map((p) => (
            <ProductTag key={p.id} product={p} baseUrl={baseUrl} />
          ))}
        </div>
      </div>
    </div>
  );
}
