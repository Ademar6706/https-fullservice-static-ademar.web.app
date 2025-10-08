"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";

function getDb(): Firestore {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
  const app = getApps().length ? getApp() : initializeApp(config);
  return getFirestore(app);
}

export async function saveOrder(payload: any) {
  const db = getDb();
  const ref = await addDoc(collection(db, "ordenes"), {
    ...payload,
    createdAt: serverTimestamp(),
    status: payload?.status ?? "recibido",
  });
  return { id: ref.id };
}

export async function getOrder(id: string) {
  const db = getDb();
  const snap = await getDoc(doc(db, "ordenes", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function listOrders() {
  const db = getDb();
  const qs = await getDocs(collection(db, "ordenes"));
  return qs.docs.map((d) => ({ id: d.id, ...d.data() }));
}
