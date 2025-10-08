"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import type jsPDF from "jspdf";
import type html2canvas from "html2canvas";
import { type FormData } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Save,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LiquiMolyLogo, FullServiceLogo } from "@/components/icons";
import { SignaturePad } from "./signature-pad";
import { useFirestore } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

type Step4Props = {
  onPrev: () => void;
  onRestart: () => void;
  data: Partial<FormData>;
  updateData: (data: Partial<FormData>) => void;
};

export default function Step4Summary({ onPrev, onRestart, data, updateData }: Step4Props) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const printAreaRef = React.useRef<HTMLDivElement>(null);
  const db = useFirestore();

  const handleSave = async () => {
    if (!db) {
      toast({
        variant: "destructive",
        title: "Error de Conexión",
        description: "No se pudo conectar a la base de datos.",
      });
      return;
    }
    if (!data.signature) {
      toast({
        variant: "destructive",
        title: "Firma Requerida",
        description: "El cliente debe firmar para guardar la orden.",
      });
      return;
    }
    if (!data.folio || !data.orderDate) {
      toast({
        variant: "destructive",
        title: "Datos Faltantes",
        description: "El folio o la fecha no se han generado. Intenta de nuevo.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "serviceOrders"), data);
      toast({
        title: "Orden Guardada",
        description: `La orden de servicio #${data.folio} ha sido guardada.`,
      });
      setIsSaved(true);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        variant: "destructive",
        title: "Error de Sincronización",
        description: "No se pudo guardar la orden en la nube. Revisa tu conexión.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    const input = printAreaRef.current;
    if (!input) return;
  
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
  
    document.body.classList.add("generating-pdf");
  
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
  
    document.body.classList.remove("generating-pdf");
  
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "p",
      unit: "px",
      format: "a4",
    });
  
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const newCanvasWidth = pdfWidth;
    const newCanvasHeight = newCanvasWidth / ratio;
  
    let heightLeft = newCanvasHeight;
    let position = 0;
  
    pdf.addImage(imgData, "PNG", 0, position, newCanvasWidth, newCanvasHeight);
    heightLeft -= pdfHeight;
  
    while (heightLeft > 0) {
      position = heightLeft - newCanvasHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, newCanvasWidth, newCanvasHeight);
      heightLeft -= pdfHeight;
    }
  
    pdf.save(`orden-servicio-${data.folio}.pdf`);
  };

  const totals = useMemo(() => {
    const totalWithIva = data.services?.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ) || 0;
    const subtotal = totalWithIva / 1.16;
    const discountAmount = subtotal * ((data.discount || 0) / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const ivaAmount = subtotalAfterDiscount * 0.16;
    const total = subtotalAfterDiscount + ivaAmount;
    return { subtotal, discountAmount, ivaAmount, total };
  }, [data.services, data.discount]);


  const handleShare = () => {
    const summaryText = `*Presupuesto de Servicio - Folio: ${data.folio}*\n\n*Cliente:* ${data.customerName}\n*Vehículo:* ${data.year} ${data.make} ${data.model}\n\n*Servicios:*\n${data.services?.map(s => `- ${s.name} (Qty: ${s.quantity})`).join('\n')}\n\n*Subtotal (sin IVA):* $${totals.subtotal.toFixed(2)}\n*Descuento (${data.discount}%):* -$${totals.discountAmount.toFixed(2)}\n*IVA (16%):* $${totals.ivaAmount.toFixed(2)}\n*Total:* $${totals.total.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/${data.customerPhone}?text=${encodeURIComponent(summaryText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div id="print-area" ref={printAreaRef} className="bg-white p-6 print-container-pdf">
        <CardHeader className="p-0 mb-6">
          <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <LiquiMolyLogo className="w-20 h-20" />
                <FullServiceLogo className="w-28 h-14" />
              </div>
              <div className="text-right">
                  <CardTitle className="font-headline text-2xl">
                  Orden de Servicio
                  </CardTitle>
                  <CardDescription>
                  Revisa todos los detalles.
                  </CardDescription>
              </div>
          </div>
           <div className="flex justify-between items-baseline text-sm pt-4 border-t">
              <p>Folio: <span className="font-semibold text-primary">{data.folio}</span></p>
              <p>Fecha: <span className="font-semibold">{data.orderDate}</span></p>
          </div>
        </CardHeader>
        <div className="space-y-6">
          <Card className="print-card">
            <CardHeader>
              <CardTitle>Detalles del Cliente y Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Cliente:</strong> {data.customerName}</div>
              <div><strong>Teléfono:</strong> {data.customerPhone}</div>
              <div><strong>Email:</strong> {data.customerEmail}</div>
              <div><strong>Vehículo:</strong> {data.year} {data.make} {data.model}</div>
              <div className="md:col-span-2"><strong>VIN:</strong> {data.vin}</div>
            </CardContent>
          </Card>

          <Card className="print-card">
            <CardHeader>
              <CardTitle>Checklist de Recepción</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {Object.entries(data.checklist || {}).map(([key, value]) => {
                if (key === 'notes' || !value) return null;
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                return <div key={key}><strong>{formattedKey}:</strong> <span className={value === 'Requiere Atención' ? 'text-destructive font-semibold' : ''}>{value}</span></div>
              })}
               {data.checklist?.notes && <div className="col-span-full pt-2"><strong>Observaciones:</strong> {data.checklist.notes}</div>}
            </CardContent>
          </Card>
          
          <Card className="print-card">
            <CardHeader>
              <CardTitle>Servicios y Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm list-disc list-inside">
                  {data.services?.map(item => (
                      <li key={item.id}>{item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)} (IVA incluido)</li>
                  ))}
              </ul>
               <Separator className="my-4" />
               <div className="space-y-2 text-sm max-w-sm ml-auto">
                  <div className="flex justify-between"><span>Subtotal (sin IVA):</span> <span>${totals.subtotal.toFixed(2)}</span></div>
                  {data.discount && data.discount > 0 && <div className="flex justify-between"><span>Descuento ({data.discount}%):</span> <span>-${totals.discountAmount.toFixed(2)}</span></div>}
                  <div className="flex justify-between"><span>IVA (16%):</span> <span>${totals.ivaAmount.toFixed(2)}</span></div>
                  <Separator/>
                  <div className="flex justify-between font-bold text-base"><span>Total:</span> <span>${totals.total.toFixed(2)}</span></div>
               </div>
            </CardContent>
          </Card>


          <Card className="print-card">
            <CardHeader>
              <CardTitle>Autorización y Firma del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="no-print">
                <SignaturePad onEnd={(signature) => updateData({ signature })} signature={data.signature || null} />
              </div>
               {data.signature && (
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold mb-2">Firma del Cliente:</p>
                  <Image src={data.signature} alt="Firma del cliente" width={200} height={100} className="print-signature bg-white" />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Al firmar, autorizo que se realice el trabajo de reparación junto con el material necesario y acepto los términos y condiciones.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="print-footer text-center text-xs text-muted-foreground pt-4 mt-4 border-t">
          Generado automáticamente por Full Service · Liqui Moly México
        </div>
      </div>

      <div className="flex justify-between mt-8 no-print">
        <Button type="button" variant="outline" onClick={onPrev} size="lg" disabled={isSaving || isSaved}>
          Anterior
        </Button>
        <div className="flex gap-2">
           <Button onClick={handleShare} variant="outline" size="lg">
            <MessageSquare className="mr-2 h-4 w-4" /> Compartir
          </Button>
          <Button onClick={handleGeneratePdf} variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" /> Generar PDF
          </Button>
          <Button onClick={handleSave} size="lg" disabled={isSaving || isSaved}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isSaved ? <CheckCircle className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaved ? "Guardado" : "Guardar Orden"}
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center no-print">
         <Button onClick={onRestart} variant="link" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" /> Iniciar Nueva Orden
          </Button>
      </div>
    </>
  );
}
