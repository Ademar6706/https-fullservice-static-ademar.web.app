"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VehicleSchema,
  type VehicleFormData,
  type FormData,
} from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { User, Car, Wrench } from "lucide-react";

type Step1Props = {
  onNext: () => void;
  updateData: (data: Partial<FormData>) => void;
  data: Partial<FormData>;
};

export default function Step1VehicleForm({
  onNext,
  updateData,
  data,
}: Step1Props) {
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: {
      customerName: data.customerName || "",
      customerPhone: data.customerPhone || "",
      customerEmail: data.customerEmail || "",
      vin: data.vin || "",
      make: data.make || "",
      model: data.model || "",
      year: data.year || new Date().getFullYear(),
      requestedServices: data.requestedServices || "",
      knownIssues: data.knownIssues || "",
    },
  });

  function onSubmit(values: VehicleFormData) {
    updateData(values);
    onNext();
  }

  return (
    <>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="font-headline text-2xl">
          Información del Cliente y Vehículo
        </CardTitle>
        <CardDescription>
          Introduce los detalles del cliente y del vehículo.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2 text-primary">
              <User size={20} /> Datos del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 555-5555" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2 text-primary">
              <Car size={20} /> Datos del Vehículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>VIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Número de Identificación Vehicular"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Camry" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Año</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ej. 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2 text-primary">
              <Wrench size={20} /> Información del Servicio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="knownIssues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problemas conocidos reportados por el cliente</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej. 'El motor hace un ruido raro', 'Los frenos se sienten esponjosos'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="requestedServices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Servicios Solicitados</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej. 'Cambio de aceite', 'Rotación de llantas'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>


          <div className="flex justify-end">
            <Button type="submit" size="lg">Siguiente: Checklist</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
