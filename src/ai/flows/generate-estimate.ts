import type { Estimate, EstimateInput } from "@/lib/definitions";

export function generateEstimate(input: EstimateInput): Estimate {
  const hrs = Number(input.manoObraHrs || 0);
  const rate = Number(input.tarifaHora || 0);
  const ref = Number(input.refacciones || 0);
  const ins = Number(input.insumos || 0);
  const d = Number(input.descuentoPct || 0);

  const subtotal = hrs * rate + ref + ins;
  const descuento = Math.max(0, subtotal * (d / 100));
  const iva = (subtotal - descuento) * 0.16;
  const total = subtotal - descuento + iva;

  return { subtotal, descuento, iva, total };
}
