import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";

const seedList: Omit<Product, "id" | "createdAt">[] = [
  { name: "Claw Hammer 16oz", category: "Hand Tools", price: 449, variants: [] },
  { name: "Cordless Drill 18V", category: "Power Tools", price: 3499, variants: ["Standard", "With Battery", "With Case"] },
  { name: "PVC Pipe 2 inch", category: "Plumbing", price: 180, variants: ["5ft", "10ft", "20ft"] },
  { name: "Emulsion Paint 10L", category: "Paints", price: 2650, variants: ["White", "Ivory", "Sky Blue"] },
  { name: "Cement Bag 50kg", category: "Building Material", price: 410, variants: [] },
  { name: "Wood Screws Pack", category: "Fasteners", price: 99, variants: ["1 inch", "2 inch", "3 inch"] },
];

// Call this once (e.g. from the "Load sample catalog" button in the Owner screen) to seed Firestore.
export async function seedProductsIfEmpty() {
  const snap = await getDocs(query(collection(db, "products"), limit(1)));
  if (!snap.empty) return { seeded: false };

  for (const p of seedList) {
    await addDoc(collection(db, "products"), { ...p, createdAt: Date.now() });
  }
  return { seeded: true };
}
