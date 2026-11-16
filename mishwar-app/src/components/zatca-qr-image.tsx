"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface ZatcaQrImageProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Renders a real scannable QR Code SVG/DataURL from ZATCA TLV Base64 or URL strings.
 * Can be scanned directly by the Saudi ZATCA VAT App or any mobile camera.
 */
export function ZatcaQrImage({ value, size = 140, className = "" }: ZatcaQrImageProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error("QR generation error:", err));
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-lg bg-slate-100 animate-pulse flex items-center justify-center text-[10px] text-slate-400 ${className}`}
      >
        QR...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt="ZATCA E-Invoice QR Code"
      width={size}
      height={size}
      className={`rounded-lg border bg-white p-1.5 shadow-2xs ${className}`}
    />
  );
}
