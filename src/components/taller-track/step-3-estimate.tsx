"use client";

import { useState, useTransition, useMemo } from "react";
import { type FormData, type ServiceItem } from "@/lib/definitions";
import { generateEstimate } from "@/ai/flows/generate-estimate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  PlusCircle,
  Loader2,
  Sparkles,
  Percent,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Estimate } from "@/ai/flows/generate-estimate";

type Step3Props = {
  onNext: () => void;
  onPrev: () => void;
  updateData: (data: Partial<FormData>) => void;
  data: Partial<FormData>;
};

// Mock data for parts/services search
const availableServices = [
  { name: "Cambio de Aceite", price: 1200, labor: 0.5 },
  { name: "Rotación de Llantas", price: 300, labor: 0.5 },
  { name: "Reemplazo de Balatas", price: 2500, labor: 1.5 },
  { name: "Reemplazo de Bujías", price: 900, labor: 1 },
  { name: "Reemplazo de Filtro de Aire", price: 450, labor: 0.2 },
];

export default function Step3Estimate({
  onNext,
  onPrev,
  updateData,
  data,
}: Step3Props) {
  const [services, setServices] = useState<ServiceItem[]>(data.services || []);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, price: 0, labor: 0 });
  const [discount, setDiscount] = useState(data.discount || 0);
  const [isPending, startTransition] = useTransition();
  const [aiEstimate, setAiEstimate] = useState<Estimate | null>(null);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity > 0 && newItem.price >= 0) {
      setServices([
        ...services,
        { ...newItem, id: crypto.randomUUID() },
      ]);
      setNewItem({ name: "", quantity: 1, price: 0, labor: 0 }); // Reset form
    }
  };

  const handleRemoveItem = (id: string) => {
    setServices(services.filter((item) => item.id !== id));
  };
  
  const handleServiceSelect = (name: string) => {
      const service = availableServices.find(s => s.name === name);
      if (service) {
          setNewItem({ name: service.name, price: service.price, labor: service.labor, quantity: 1 });
      } else {
        setNewItem(prev => ({ ...prev, name }));
      }
  }

  const handleGenerateEstimate = () => {
    startTransition(() => {
      const totalLabor = services.reduce((acc, s) => acc + (s.labor * s.quantity), 0);
      const totalParts = services.reduce((acc, s) => acc + (s.price * s.quantity), 0);
      
      const result = generateEstimate({
          manoObraHrs: totalLabor,
          tarifaHora: 150, // Example hourly rate
          refacciones: totalParts,
          insumos: 50, // Example supplies cost
          descuentoPct: discount,
      });
      setAiEstimate(result);
      toast({
        title: "Estimado Generado",
        description: "Se ha calculado una sugerencia de presupuesto.",
      });
    });
  };

  const totals = useMemo(() => {
    const totalWithIva = services.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const subtotal = totalWithIva / 1.16;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const ivaAmount = subtotalAfterDiscount * 0.16;
    const total = subtotalAfterDiscount + ivaAmount;

    return { subtotal, discountAmount, ivaAmount, total };
  }, [services, discount]);

  const handleNext = () => {
    const dataToUpdate = { 
        services, 
        discount, 
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        ivaAmount: totals.ivaAmount,
        total: totals.total,
    };
    updateData(dataToUpdate);
    onNext();
  };

  return (
    <>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="font-headline text-2xl">
          Calculadora de Presupuesto
        </CardTitle>
        <CardDescription>
          Añade partes y servicios para calcular el presupuesto. El precio debe incluir IVA. Usa el generador IA para un desglose detallado.
        </CardDescription>
      </CardHeader>
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-slate-50">
          <h3 className="font-medium mb-2">Añadir Servicio / Parte</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
            <div className="md:col-span-3">
              <Label className="text-sm font-medium">Nombre del Item</Label>
              <Input
                placeholder="Ej. Cambio de Aceite"
                value={newItem.name}
                onChange={(e) => handleServiceSelect(e.target.value)}
                list="services-list"
              />
               <datalist id="services-list">
                    {availableServices.map(s => <option key={s.name} value={s.name} />)}
                </datalist>
            </div>
             <div>
              <Label className="text-sm font-medium">Precio (con IVA)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Cantidad</Label>
              <Input
                type="number"
                placeholder="1"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>
            <Button onClick={handleAddItem} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Precio (con IVA)</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Subtotal (con IVA)</TableHead>
              <TableHead className="w-[80px] text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length > 0 ? (
              services.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No hay servicios agregados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal (sin IVA):</span>
                    <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <Label htmlFor="discount" className="text-muted-foreground flex-shrink-0">Descuento:</Label>
                    <div className="relative w-24">
                        <Input
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                            className="pr-6"
                        />
                        <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">IVA (16%):</span>
                    <span className="font-medium">${totals.ivaAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">${totals.total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleGenerateEstimate}
            disabled={isPending}
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-500 text-white"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generar Sugerencia de Presupuesto
          </Button>
        </div>

        {aiEstimate && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="font-headline">Sugerencia de Presupuesto</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>Se ha calculado un desglose sugerido:</p>
              <ul className="list-disc pl-5 text-sm">
                <li>Subtotal: ${aiEstimate.subtotal.toFixed(2)}</li>
                <li>Descuento: ${aiEstimate.descuento.toFixed(2)}</li>
                <li>IVA: ${aiEstimate.iva.toFixed(2)}</li>
              </ul>
              <p className="text-lg font-bold text-foreground">
                Costo Total Estimado: ${aiEstimate.total.toFixed(2)}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={onPrev} size="lg">
          Anterior
        </Button>
        <Button onClick={handleNext} size="lg">Siguiente: Revisar y Firmar</Button>
      </div>
    </>
  );
}

    