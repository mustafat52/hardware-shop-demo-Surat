import "./globals.css";

export const metadata = {
  title: "Ironworks Supply — Demo",
  description: "QR catalog, self-billing cart, and counter lookup demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">{children}</body>
    </html>
  );
}
