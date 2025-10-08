import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { FirebaseProvider, initializeFirebase } from '@/lib/firebase';

const { app, firestore, auth } = initializeFirebase();

export const metadata: Metadata = {
  title: 'Recepción de Vehículos Full Service Liqui Moly México',
  description: 'Vehicle Service Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseProvider firebaseApp={app} firestore={firestore} auth={auth}>
          {children}
        </FirebaseProvider>
        <Toaster />
      </body>
    </html>
  );
}
