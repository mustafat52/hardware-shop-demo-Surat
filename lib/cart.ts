import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Cart, CartItem } from "@/lib/types";
import { generateCartId } from "@/lib/format";

export async function createCart(items: CartItem[]): Promise<string> {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  let id = generateCartId();

  // avoid rare collision with an existing cart id
  let existing = await getDoc(doc(db, "carts", id));
  while (existing.exists()) {
    id = generateCartId();
    existing = await getDoc(doc(db, "carts", id));
  }

  const cart: Cart = { id, items, total, paid: false, createdAt: Date.now(), paidAt: null };
  await setDoc(doc(db, "carts", id), cart);
  return id;
}

export async function getCartById(id: string): Promise<Cart | null> {
  const snap = await getDoc(doc(db, "carts", id));
  if (!snap.exists()) return null;
  return snap.data() as Cart;
}

export function subscribeToCart(id: string, callback: (cart: Cart | null) => void) {
  return onSnapshot(doc(db, "carts", id), (snap) => {
    callback(snap.exists() ? (snap.data() as Cart) : null);
  });
}

export async function markCartPaid(id: string) {
  await updateDoc(doc(db, "carts", id), { paid: true, paidAt: Date.now() });
}
