import type { ChecklistItem } from "@/lib/definitions";

export function generateChecklist(input: { motivo?: string }): ChecklistItem[] {
  const base: ChecklistItem[] = [
    { name: "Llantas", status: "Por revisar" },
    { name: "Frenos", status: "Por revisar" },
    { name: "Luces", status: "Por revisar" },
    { name: "Líquidos", status: "Por revisar" },
    { name: "Batería", status: "Por revisar" },
  ];

  const motivo = (input.motivo || "").toLowerCase();
  if (motivo.includes("aceite")) {
    base.push({ name: "Filtro de aceite", status: "Por revisar" });
    base.push({ name: "Fugas motor", status: "Por revisar" });
  }
  if (motivo.includes("freno")) {
    base.push({ name: "Espesor de pastas y discos", status: "Por revisar" });
  }
  if (motivo.includes("afinación")) {
    base.push({ name: "Bujías", status: "Por revisar" });
    base.push({ name: "Filtro de aire", status: "Por revisar" });
  }

  return base;
}
