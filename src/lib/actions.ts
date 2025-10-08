"use client";

import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";

export async function saveOrder(db: Firestore, payload: any) {
  const ref = await addDoc(collection(db, "serviceOrders"), {
    ...payload,
    createdAt: serverTimestamp(),
    status: payload?.status ?? "recibido",
  });
  return { id: ref.id };
}

export async function getOrder(db: Firestore, id: string) {
  const snap = await getDoc(doc(db, "serviceOrders", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function listOrders(db: Firestore) {
  const qs = await getDocs(collection(db, "serviceOrders"));
  return qs.docs.map((d) => ({ id: d.id, ...d.data() }));
}
