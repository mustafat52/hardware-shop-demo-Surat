import Link from "next/link";
import Header from "@/components/Header";

export default function LandingPage() {
  const tiles = [
    { href: "/owner", label: "Owner Panel", desc: "Add products, view QR tags", num: "01" },
    { href: "/shop", label: "Customer Shop", desc: "Browse catalog, simulate a scan", num: "02" },
    { href: "/billing", label: "Billing Counter", desc: "Look up a Cart ID, complete sale", num: "03" },
  ];

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-paper">
      <Header subtitle="DEMO — pick a screen to open on this device" />
      <div className="p-6 grid gap-4">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="bg-white rounded-lg p-5 border border-gray-200 hover:border-orange transition flex items-center gap-4"
          >
            <span className="font-mono text-xs bg-charcoal text-white rounded px-2 py-1">{t.num}</span>
            <div>
              <div className="font-display font-bold text-xl uppercase">{t.label}</div>
              <div className="text-sm text-gray-500">{t.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
