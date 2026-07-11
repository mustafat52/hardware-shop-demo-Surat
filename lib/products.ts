import {
  collection, addDoc, doc, getDoc, getDocs, onSnapshot, query, orderBy, limit, startAfter,
  QueryDocumentSnapshot, DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/types";

const productsCol = collection(db, "products");
const PAGE_SIZE = 20;

// Live listener — fine for small catalogs, but reads EVERY document each time
// it fires. Kept for the customer Shop browse page for now (small demo scale).
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = query(productsCol, orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const list: Product[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
    callback(list);
  });
}

// One-time paginated fetch — costs only PAGE_SIZE reads per call, regardless
// of how many total products exist. Used by the Owner Panel.
export async function getProductsPage(cursor?: QueryDocumentSnapshot<DocumentData> | null) {
  const q = cursor
    ? query(productsCol, orderBy("createdAt", "asc"), startAfter(cursor), limit(PAGE_SIZE))
    : query(productsCol, orderBy("createdAt", "asc"), limit(PAGE_SIZE));

  const snap = await getDocs(q);
  const products: Product[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }));
  const lastDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null;
  const hasMore = snap.docs.length === PAGE_SIZE;
  return { products, lastDoc, hasMore };
}

export async function addProduct(input: {
  name: string;
  category: string;
  price: number;
  variants: string[];
  imageUrl?: string;
}) {
  const docRef = await addDoc(productsCol, { ...input, createdAt: Date.now() });
  return docRef.id;
}

// Uploads directly to Cloudinary from the browser (unsigned preset) and
// returns the hosted image URL to store in Firestore.
export async function uploadProductImage(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary env vars are missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Product, "id">) };
}