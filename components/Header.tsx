import Link from "next/link";

export default function Header({ subtitle }: { subtitle: string }) {
  return (
    <div className="bg-charcoal text-white px-6 pt-5 pb-4">
      <Link href="/">
        <h1 className="font-display font-extrabold text-3xl uppercase tracking-wide">
          IRON<span className="text-orange">WORKS</span> SUPPLY
        </h1>
      </Link>
      <p className="font-mono text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
