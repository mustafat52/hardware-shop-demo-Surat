"use client";
import { QRCodeSVG } from "qrcode.react";

export default function QRCode({ value, size = 100 }: { value: string; size?: number }) {
  return (
    <div className="inline-block bg-white p-2 rounded border border-paper">
      <QRCodeSVG value={value} size={size} bgColor="#FFFFFF" fgColor="#1E2124" level="M" />
    </div>
  );
}
