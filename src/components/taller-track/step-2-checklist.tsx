"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChecklistSchema,
  type ChecklistFormData,
} from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";

type Step2Props = {
  onNext: () => void;
  onPrev: () => void;
  updateData: (data: { checklist: Partial<ChecklistFormData> }) => void;
  data: Partial<ChecklistFormData>;
};

const checklistItems = [
  { name: "tires", label: "Llantas" },
  { name: "lights", label: "Luces y Señales" },
  { name: "brakes", label: "Frenos" },
  { name: "liquidos", label: "Líquidos" },
  { name: "bateria", label: "Batería" },
] as const;

const options = ["OK", "Requiere Atención", "N/A"];

export default function Step2Checklist({
  onNext,
  onPrev,
  updateData,
  data,
}: Step2Props) {
  const form = useForm<ChecklistFormData>({
    resolver: zodResolver(ChecklistSchema),
    defaultValues: {
      tires: data.tires || "N/A",
      lights: data.lights || "N/A",
      brakes: data.brakes || "N/A",
      liquidos: data.liquidos || "N/A",
      bateria: data.bateria || "N/A",
      notes: data.notes || "",
    },
  });

  function onSubmit(values: ChecklistFormData) {
    updateData({ checklist: values });
    onNext();
  }

  return (
    <>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="font-headline text-2xl">
          Checklist de Recepción del Vehículo
        </CardTitle>
        <CardDescription>
          Documenta la condición del vehículo a su llegada.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {checklistItems.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem className="space-y-3 p-4 rounded-lg border bg-card">
                    <FormLabel className="font-semibold text-base">{item.label}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4 pt-2"
                      >
                        {options.map((option) => (
                          <FormItem
                            key={option}
                            className="flex items-center space-x-2 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={option} id={`${item.name}-${option}`} />
                            </FormControl>
                            <FormLabel htmlFor={`${item.name}-${option}`} className="font-normal">
                              {option}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">Observaciones Adicionales</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Anota cualquier daño específico, rayones o comentarios..."
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev} size="lg">
              Anterior
            </Button>
            <Button type="submit" size="lg">Siguiente: Presupuesto</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
