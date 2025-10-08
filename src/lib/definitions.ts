import { z } from "zod";

export const VehicleSchema = z.object({
  customerName: z.string().min(2, "Nombre es requerido"),
  customerPhone: z.string().min(10, "Número de teléfono válido es requerido"),
  customerEmail: z.string().email("Correo electrónico válido es requerido"),
  vin: z.string().length(17, "VIN debe tener 17 caracteres"),
  make: z.string().min(2, "Marca es requerida"),
  model: z.string().min(1, "Modelo es requerido"),
  year: z.coerce
    .number()
    .min(1900, "Año debe ser después de 1900")
    .max(new Date().getFullYear() + 1, `Año no puede ser en el futuro`),
  requestedServices: z.string().optional(),
  knownIssues: z.string().min(5, "Por favor describe los problemas"),
});

export type VehicleFormData = z.infer<typeof VehicleSchema>;

export const ChecklistSchema = z.object({
  tires: z.string(),
  lights: z.string(),
  brakes: z.string(),
  liquidos: z.string(),
  bateria: z.string(),
  notes: z.string().optional(),
});

export type ChecklistFormData = z.infer<typeof ChecklistSchema>;

export type ServiceItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  labor: number;
};

export type EstimateData = {
  services: ServiceItem[];
  discount: number;
};

export type FormData = VehicleFormData & {
  checklist: Partial<ChecklistFormData>;
  services: ServiceItem[];
  discount: number;
  folio: string;
  orderDate: string;
  signature: string; // data URL
  subtotal?: number;
  discountAmount?: number;
  ivaAmount?: number;
  total?: number;
};
