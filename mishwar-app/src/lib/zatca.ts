/**
 * ZATCA Phase 1 & 2 E-Invoicing TLV (Tag-Length-Value) Base64 Encoder
 * Compliant with Saudi ZATCA Simplified Tax Invoice requirements (الفاتورة الضريبية المبسطة)
 */

export interface ZatcaInvoicePayload {
  sellerName: string;
  vatRegistrationNumber: string; // 15 digits starting and ending with 3
  timestamp: string; // ISO 8601 format
  invoiceTotalWithVat: string;
  vatTotal: string;
}

function encodeTlvTag(tag: number, value: string): Uint8Array {
  const encoder = new TextEncoder();
  const valueBytes = encoder.encode(value);
  const result = new Uint8Array(2 + valueBytes.length);
  result[0] = tag;
  result[1] = valueBytes.length;
  result.set(valueBytes, 2);
  return result;
}

export function generateZatcaQrBase64(payload: ZatcaInvoicePayload): string {
  const t1 = encodeTlvTag(1, payload.sellerName);
  const t2 = encodeTlvTag(2, payload.vatRegistrationNumber);
  const t3 = encodeTlvTag(3, payload.timestamp);
  const t4 = encodeTlvTag(4, payload.invoiceTotalWithVat);
  const t5 = encodeTlvTag(5, payload.vatTotal);

  const totalLength = t1.length + t2.length + t3.length + t4.length + t5.length;
  const combined = new Uint8Array(totalLength);

  let offset = 0;
  for (const chunk of [t1, t2, t3, t4, t5]) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  // Convert Uint8Array to Base64 in both Node.js and Browser environments
  if (typeof Buffer !== "undefined") {
    return Buffer.from(combined).toString("base64");
  }

  let binary = "";
  combined.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function calculateSaudiVat(amountIncludingVat: number) {
  const netAmount = +(amountIncludingVat / 1.15).toFixed(2);
  const vatAmount = +(amountIncludingVat - netAmount).toFixed(2);
  return {
    netAmount,
    vatAmount,
    totalAmount: amountIncludingVat,
  };
}
