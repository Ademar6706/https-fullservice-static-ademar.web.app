'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type jsPDF from 'jspdf';
import type html2canvas from 'html2canvas';

import { useFirestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { FormData } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Download, MessageSquare } from 'lucide-react';

export default function OrderDetailPage() {
  const [order, setOrder] = useState<Partial<FormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const printAreaRef = useRef<HTMLDivElement>(null);
  const { id } = params;
  const db = useFirestore();

  useEffect(() => {
    if (typeof id !== 'string' || !db) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'serviceOrders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Partial<FormData>);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, db]);

  const totals = useMemo(() => {
    if (!order?.services) return { subtotal: 0, discountAmount: 0, ivaAmount: 0, total: 0 };
    const totalWithIva = order.services.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const subtotal = totalWithIva / 1.16;
    const discountAmount = subtotal * ((order.discount || 0) / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const ivaAmount = subtotalAfterDiscount * 0.16;
    const total = subtotalAfterDiscount + ivaAmount;
    return { subtotal, discountAmount, ivaAmount, total };
  }, [order?.services, order?.discount]);

  const handleGeneratePdf = async () => {
    const input = printAreaRef.current;
    if (!input) return;

    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    document.body.classList.add('generating-pdf');
    const canvas = await html2canvas(input, { scale: 2, useCORS: true });
    document.body.classList.remove('generating-pdf');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`orden-servicio-${order?.folio}.pdf`);
  };

  const handleShare = () => {
    if (!order) return;
    const summaryText = `*Resumen de Servicio - Folio: ${order.folio}*\n\n*Cliente:* ${order.customerName}\n*Vehículo:* ${order.year} ${order.make} ${order.model}\n\n*Servicios:*\n${order.services?.map(s => `- ${s.name} (Qty: ${s.quantity})`).join('\n')}\n\n*Subtotal (sin IVA):* $${totals.subtotal.toFixed(2)}\n*Descuento (${order.discount}%):* -$${totals.discountAmount.toFixed(2)}\n*IVA (16%):* $${totals.ivaAmount.toFixed(2)}\n*Total:* $${totals.total.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/${order.customerPhone}?text=${encodeURIComponent(summaryText)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <h2 className="text-2xl font-bold mb-4">Orden no encontrada</h2>
        <p className="text-muted-foreground mb-6">No pudimos encontrar la orden de servicio que estás buscando.</p>
        <Button asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al listado
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6 no-print">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Button>
            <div className="flex gap-2">
                <Button onClick={handleShare} variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" /> Compartir
                </Button>
                <Button onClick={handleGeneratePdf}>
                    <Download className="mr-2 h-4 w-4" /> Descargar PDF
                </Button>
            </div>
        </div>
        <Card id="print-area" ref={printAreaRef} className="shadow-2xl print-container print-container-pdf bg-white">
          <CardContent className="p-6 md:p-8">
            <header className="mb-6">
              <div className="flex justify-between items-start">
                  <div>
                      <h1 className="font-headline text-2xl font-bold text-primary">
                        Orden de Servicio
                      </h1>
                  </div>
              </div>
              <div className="flex justify-between items-baseline text-sm pt-4">
                  <p>Folio: <span className="font-semibold text-primary">{order.folio}</span></p>
                  <p>Fecha: <span className="font-semibold">{order.orderDate}</span></p>
              </div>
            </header>
            <div className="space-y-6">
              <Card className="print-card">
                <CardHeader>
                  <CardTitle>Detalles del Cliente y Vehículo</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Cliente:</strong> {order.customerName}</div>
                  <div><strong>Teléfono:</strong> {order.customerPhone}</div>
                  <div><strong>Email:</strong> {order.customerEmail}</div>
                  <div><strong>Vehículo:</strong> {order.year} {order.make} {order.model}</div>
                  <div className="md:col-span-2"><strong>VIN:</strong> {order.vin}</div>
                </CardContent>
              </Card>

              <Card className="print-card">
                <CardHeader>
                  <CardTitle>Checklist de Recepción</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(order.checklist || {}).map(([key, value]) => {
                    if (key === 'notes' || !value) return null;
                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                    return <div key={key}><strong>{formattedKey}:</strong> <span className={value === 'Requiere Atención' ? 'text-destructive font-semibold' : ''}>{value}</span></div>
                  })}
                  {order.checklist?.notes && <div className="col-span-full pt-2"><strong>Observaciones:</strong> {order.checklist.notes}</div>}
                </CardContent>
              </Card>
              
              <Card className="print-card">
                <CardHeader>
                  <CardTitle>Servicios y Presupuesto</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm list-disc list-inside">
                      {order.services?.map(item => (
                          <li key={item.id}>{item.name} (x{item.quantity}) - ${(item.price * item.quantity).toFixed(2)} (IVA incluido)</li>
                      ))}
                  </ul>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-sm max-w-sm ml-auto">
                      <div className="flex justify-between"><span>Subtotal (sin IVA):</span> <span>${totals.subtotal.toFixed(2)}</span></div>
                      {order.discount && order.discount > 0 && <div className="flex justify-between"><span>Descuento ({order.discount}%):</span> <span>-${totals.discountAmount.toFixed(2)}</span></div>}
                      <div className="flex justify-between"><span>IVA (16%):</span> <span>${totals.ivaAmount.toFixed(2)}</span></div>
                      <Separator/>
                      <div className="flex justify-between font-bold text-base"><span>Total:</span> <span>${totals.total.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="print-card">
                <CardHeader>
                  <CardTitle>Autorización del Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.signature ? (
                    <div>
                      <p className="text-sm font-semibold mb-2">Firma del Cliente:</p>
                      <Image src={order.signature} alt="Firma del cliente" width={200} height={100} className="bg-white print-signature" />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No se registró firma para esta orden.</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    Se autoriza que se realice el trabajo de reparación junto con el material necesario y se aceptan los términos y condiciones.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="print-footer text-center text-xs text-muted-foreground pt-4 mt-4 border-t">
              Generado automáticamente por Full Service · Liqui Moly México
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
