
"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useFirestore } from "@/lib/firebase/client-provider";
import { getOrder } from "@/lib/actions";
import { useSearchParams } from "next/navigation";
import { Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderData = Record<string, any> | null;

export default function OrderViewClient() {
  const [order, setOrder] = useState<OrderData>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const db = useFirestore();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!db) return;

    const fetchOrder = async () => {
      const id = searchParams.get("id");
      if (!id) {
        setErr("Falta el parámetro ?id=<ordenId>");
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrder(db, id);
        if (!orderData) {
          setErr("No existe la orden con ese ID.");
        } else {
          setOrder(orderData);
        }
      } catch (e: any) {
        console.error("Error fetching order:", e);
        setErr(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [db, searchParams]);

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Cargando orden…</span>
        </div>
    </div>
  );

  if (err) return <div className="p-6 text-xl text-destructive text-center">{err}</div>;
  if (!order) return <div className="p-6 text-xl text-center">No se encontraron datos de la orden.</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 bg-slate-50 min-h-screen">
       <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">
              Orden de Servicio: {order.folio || "(sin folio)"}
          </h1>
          <p className="text-lg text-muted-foreground">{order.orderDate}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Volver a la Recepción
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-base">
        <div className="bg-white p-4 rounded-lg shadow-sm"><b>Cliente:</b> {order.customerName || "—"}</div>
        <div className="bg-white p-4 rounded-lg shadow-sm"><b>Teléfono:</b> {order.customerPhone || "—"}</div>
        <div className="bg-white p-4 rounded-lg shadow-sm"><b>Email:</b> {order.customerEmail || "—"}</div>
        <div className="bg-white p-4 rounded-lg shadow-sm"><b>Vehículo:</b> {[order.year, order.make, order.model].filter(Boolean).join(" ") || "—"}</div>
        <div className="bg-white p-4 rounded-lg shadow-sm"><b>VIN:</b> {order.vin || "—"}</div>
        <div className="bg-white p-4 rounded-lg shadow-sm"><b>Servicios Solicitados:</b> {order.requestedServices || "—"}</div>
         <div className="md:col-span-full bg-white p-4 rounded-lg shadow-sm"><b>Problemas Reportados:</b> {order.knownIssues || "—"}</div>
      </div>

       <div className="bg-white p-4 rounded-lg shadow-sm text-base">
        <h2 className="font-bold text-lg mb-2">Checklist de Recepción</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div><b>Llantas:</b> {order.checklist?.tires}</div>
            <div><b>Frenos:</b> {order.checklist?.brakes}</div>
            <div><b>Luces:</b> {order.checklist?.lights}</div>
            <div><b>Líquidos:</b> {order.checklist?.liquidos}</div>
            <div><b>Batería:</b> {order.checklist?.bateria}</div>
        </div>
        {order.checklist?.notes && <p className="mt-2"><b>Notas:</b> {order.checklist.notes}</p>}
      </div>

       <div className="bg-white p-4 rounded-lg shadow-sm text-base">
         <h2 className="font-bold text-lg mb-2">Presupuesto</h2>
         <div className="space-y-1 max-w-md ml-auto">
            {order.services?.map((s: any, i:number) => (
                <div key={i} className="flex justify-between"><span>{s.name} (x{s.quantity})</span><span>${(s.price * s.quantity).toFixed(2)}</span></div>
            ))}
            <hr className="my-2"/>
            <div className="flex justify-between"><span>Subtotal (sin IVA):</span><span>${order.subtotal?.toFixed(2) ?? "0.00"}</span></div>
            <div className="flex justify-between"><span>Descuento ({order.discount}%):</span><span>-${order.discountAmount?.toFixed(2) ?? "0.00"}</span></div>
            <div className="flex justify-between"><span>IVA (16%):</span><span>${order.ivaAmount?.toFixed(2) ?? "0.00"}</span></div>
            <hr className="my-2 font-bold"/>
            <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>${order.total?.toFixed(2) ?? "0.00"}</span></div>
         </div>
      </div>


      {order.signature ? (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm font-bold mb-2">Firma del cliente:</div>
          <img src={order.signature} alt="Firma" className="h-24 w-auto border rounded bg-gray-50" />
        </div>
      ) : null}
    </div>
  );
}
