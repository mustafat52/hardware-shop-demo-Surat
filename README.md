# Ironworks Supply — QR Shop Demo

A real, working demo (fake shop name, fake sample products) of:
- Owner panel to add products and auto-generate a QR code per product
- Customer flow: scan QR → view product/variants → add to cart → get a Cart ID
- Billing counter: look up a Cart ID → see the itemized bill → confirm payment

Built with Next.js (App Router) + TypeScript + Tailwind, with Firestore for
cross-device cart/product data (so a phone and a billing tablet see the same
data in real time) via the Firebase client SDK — no custom backend server.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up Firebase (free tier is enough)

1. Go to https://console.firebase.google.com → **Add project** (any name, e.g. "ironworks-demo").
2. Once created, click the **</>** (web app) icon to register a web app.
3. Copy the `firebaseConfig` values it gives you.
4. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
5. Paste the matching values into `.env.local`.
6. In the Firebase console, go to **Firestore Database → Create database** →
   start in **test mode** (fine for a demo; open read/write, no auth needed).

## 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000 — you'll see three tiles: Owner Panel, Customer Shop, Billing Counter.

On the Owner Panel, click **"Load sample catalog (one-time)"** to seed 6 fake
hardware products into Firestore. Add more anytime with the form.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com → **Add New Project** → import the repo.
3. In the Vercel project's **Settings → Environment Variables**, add the same
   6 `NEXT_PUBLIC_FIREBASE_*` keys from your `.env.local`.
4. Deploy. Vercel gives you a live URL (e.g. `https://ironworks-demo.vercel.app`).

Once deployed, the QR codes shown in the Owner Panel are **real, scannable
QR codes** pointing at that live URL — scanning one with an actual phone
camera opens that product's real page.

## How to demo it to the client

- Open `/owner` on your laptop — add a product live, show the QR appear instantly.
- On your phone, scan that QR (or open `/shop` and tap a product) — walk through
  choosing a variant, adding to cart, and generating a Cart ID.
- On a second device (or the same laptop, `/billing`) — type in that Cart ID
  and show the bill appear already totaled, then confirm payment.

## Notes / next steps if the client says yes

- Firestore is in "test mode" (open access) — fine for a demo, not for
  production. Before going live, add Firebase Auth + proper security rules.
- `lib/products.ts` and `lib/cart.ts` are the only files that talk to the
  database — swapping Firestore for a custom backend later only touches
  these two files, not the UI.
- Consider adding: inventory deduction on sale, low-stock alerts, a sales
  dashboard, WhatsApp/SMS receipts, multi-staff logins.
