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
  imageUrl?: string;
}) {
  const docRef = await addDoc(productsCol, { ...input, createdAt: Date.now() });
  return docRef.id;
}

// Uploads directly to Cloudinary from the browser (unsigned preset) and
// returns the hosted image URL to store in Firestore. No Firebase billing needed.
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