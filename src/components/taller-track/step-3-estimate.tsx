"use client";

import { useState, useTransition, useMemo } from "react";
import { type FormData, type ServiceItem } from "@/lib/definitions";
import { getAiEstimate } from "@/lib/actions";
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
import type { EstimateOutput } from "@/ai/flows/generate-estimate";

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
  const [aiEstimate, setAiEstimate] = useState<EstimateOutput | null>(null);
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
    if (!data.make || !data.model) {
      toast({
        variant: "destructive",
        title: "Faltan datos del vehículo",
        description: "Por favor, complete los detalles del vehículo en el paso 1.",
      });
      return;
    }
    startTransition(async () => {
      const result = await getAiEstimate(data, services);
      if (result.success) {
        setAiEstimate(result.data);
        if (result.data.partsCost) {
            const newServices = [...services];
            const partsService = newServices.find(s => s.name === 'Partes Adicionales (IA)');
            if (partsService) {
                partsService.price = result.data.partsCost;
            } else {
                newServices.push({ name: 'Partes Adicionales (IA)', price: result.data.partsCost, quantity: 1, labor: 0, id: crypto.randomUUID() });
            }
            setServices(newServices);
        }
        if (result.data.laborCost) {
            const newServices = [...services];
            const laborService = newServices.find(s => s.name === 'Mano de Obra (IA)');
            if (laborService) {
                laborService.price = result.data.laborCost;
            } else {
                newServices.push({ name: 'Mano de Obra (IA)', price: result.data.laborCost, quantity: 1, labor: 0, id: crypto.randomUUID() });
            }
            setServices(newServices);
        }

        toast({
          title: "Estimado Generado",
          description: "El estimado con IA ha sido generado y añadido a la lista.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    });
  };

  const totals = useMemo(() => {
    const subtotal = services.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const ivaAmount = subtotalAfterDiscount * 0.16;
    const total = subtotalAfterDiscount + ivaAmount;
    return { subtotal, discountAmount, ivaAmount, total };
  }, [services, discount]);

  const handleNext = () => {
    updateData({ services, discount, ...totals });
    onNext();
  };

  return (
    <>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="font-headline text-2xl">
          Calculadora de Presupuesto
        </CardTitle>
        <CardDescription>
          Añade partes y servicios para calcular el presupuesto. Usa el generador IA para un desglose detallado.
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
              <Label className="text-sm font-medium">Precio</Label>
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
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
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
                    <span className="text-muted-foreground">Subtotal:</span>
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
            Generar Sugerencia con IA
          </Button>
        </div>

        {aiEstimate && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="font-headline">Sugerencia de Presupuesto (IA)</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>La IA ha analizado la información y sugiere los siguientes costos:</p>
              <ul className="list-disc pl-5 text-sm">
                <li>Costo de Partes: ${aiEstimate.partsCost.toFixed(2)}</li>
                <li>Costo de Mano de Obra: ${aiEstimate.laborCost.toFixed(2)}</li>
                <li>Costo de Suministros: ${aiEstimate.suppliesCost.toFixed(2)}</li>
              </ul>
              <p className="text-lg font-bold text-foreground">
                Costo Total Estimado (IA): ${aiEstimate.totalCost.toFixed(2)}
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
