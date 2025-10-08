"use client";

export type AnalyzeInput = {
  descripcion?: string;
  km?: number;
  anio?: number;
  motivo?: string;
};

export type AnalyzeResult = {
  summary: string;
  flags: string[];
  suggestions: string[];
};

export function analyzeServiceData(input: AnalyzeInput): AnalyzeResult {
  const desc = (input.descripcion || "").toLowerCase();
  const motivo = (input.motivo || "").toLowerCase();

  const flags: string[] = [];
  const suggestions: string[] = [];

  if ((input.km ?? 0) > 80000) {
    flags.push("Alto kilometraje");
    suggestions.push("Revisar banda/cadena de distribución");
    suggestions.push("Inspección de suspensión y bujes");
  }
  if (motivo.includes("aceite") || desc.includes("aceite")) {
    suggestions.push("Revisar fugas, cárter y sello de cigüeñal");
  }
  if (motivo.includes("ruido") || desc.includes("ruido")) {
    suggestions.push("Inspección de rodamientos, poleas y suspensión");
  }
  if (motivo.includes("freno") || desc.includes("freno")) {
    suggestions.push("Medir pastas y discos; purga si aplica");
  }

  const summary =
    input.descripcion?.trim() ||
    `Motivo: ${input.motivo || "No especificado"} · KM: ${input.km ?? "—"}`;

  return { summary, flags, suggestions };
}
