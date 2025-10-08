"use server";

import {
  generateEstimate,
  type EstimateInput,
  type EstimateOutput,
} from "@/ai/flows/generate-estimate";
import type { ServiceItem, FormData } from "./definitions";

export async function getAiEstimate(
  data: Partial<FormData>,
  services: ServiceItem[]
): Promise<{ success: true, data: EstimateOutput } | { success: false, error: string }> {
  try {
    const input: EstimateInput = {
      vehicleMake: data.make || "",
      vehicleModel: data.model || "",
      vehicleYear: String(data.year) || "",
      serviceSelected: services.map((s) => s.name).join(", "),
      checklistObservations: data.checklist?.notes || "",
    };

    const result = await generateEstimate(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error generating estimate:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
