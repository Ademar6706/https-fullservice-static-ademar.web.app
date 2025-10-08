"use client";

import { useEffect, useMemo, useState } from "react";
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, doc, getDoc, type Firestore } from "firebase/firestore";

type OrderData = Record<string, any> | null;

function getFirebase() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
  const db: Firestore = getFirestore(app);
  return { app, db };
}

export default function OrderViewPage() {
  const [order, setOrder] = useState<OrderData>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const id = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("id") || "";
  }, []);

  useEffect(() => {
    (async () => {
      if (!id) {
        setErr("Falta el parámetro ?id=<ordenId>");
        setLoading(false);
        return;
      }
      try {
        const { db } = getFirebase();
        const snap = await getDoc(doc(db, "ordenes", id));
        if (!snap.exists()) {
          setErr("No existe la orden con ese ID.");
        } else {
          setOrder(snap.data());
        }
      } catch (e: any) {
        setErr(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Cargando orden…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!order) return <div className="p-6">Sin datos</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Orden: {order.folio || "(sin folio)"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div><b>Cliente:</b> {order.clienteNombre || "—"}</div>
        <div><b>Teléfono:</b> {order.clienteTelefono || "—"}</div>
        <div><b>Vehículo:</b> {[order.vehiculoMarca, order.vehiculoModelo, order.vehiculoAnio].filter(Boolean).join(" ") || "—"}</div>
        <div><b>Placas:</b> {order.vehiculoPlacas || "—"}</div>
        <div><b>KM entrada:</b> {order.kmEntrada || "—"}</div>
        <div><b>Motivo:</b> {order.motivo || "—"}</div>
      </div>

      <div className="text-sm">
        <b>Checklist:</b> Llantas {order.llantas}, Frenos {order.frenos}, Luces {order.luces}, Líquidos {order.liquidos}, Batería {order.bateria}
      </div>

      <div className="text-sm">
        <b>Total:</b> ${order?.totales?.total?.toFixed?.(2) ?? "—"}
      </div>

      {order.firmaCliente ? (
        <div>
          <div className="text-xs text-gray-500">Firma del cliente:</div>
          <img src={order.firmaCliente} alt="Firma" className="h-24 w-auto border rounded" />
        </div>
      ) : null}
    </div>
  );
}
