import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ClientOnly } from '@/components/client-only';
import { FirebaseClientProvider } from '@/lib/firebase/client-provider';
import { inter } from './fonts';

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
    <html lang="es">
      <head />
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ClientOnly>
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
        </ClientOnly>
        <Toaster />
      </body>
    </html>
  );
}
