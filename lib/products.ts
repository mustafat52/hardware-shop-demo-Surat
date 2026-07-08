import {
  collection, addDoc, doc, getDoc, onSnapshot, query, orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";

const productsCol = collection(db, "products");

export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = query(productsCol, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const list: Product[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
    callback(list);
  });
}

export async function addProduct(input: {
  name: string;
  category: string;
  price: number;
  variants: string[];
}) {
  const docRef = await addDoc(productsCol, { ...input, createdAt: Date.now() });
  return docRef.id;
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Product, "id">) };
}
