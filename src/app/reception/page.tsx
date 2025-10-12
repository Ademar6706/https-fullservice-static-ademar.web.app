'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { MainForm } from '@/components/taller-track/main-form';
import { Button } from '@/components/ui/button';
import { ListOrdered } from 'lucide-react';

export default function ReceptionPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Image src="/fullservice.png" alt="Full Service Logo" width={250} height={80} className="h-20 w-auto" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">Recepción de Vehículos</h1>
              <p className="text-lg text-muted-foreground">Full Service · Liqui Moly México</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/orders">
              <ListOrdered className="mr-2 h-4 w-4" />
              Ver Órdenes de Servicio
            </Link>
          </Button>
        </header>

        <main>
          <Card className="shadow-2xl">
            <MainForm />
          </Card>
        </main>
      </div>
    </div>
  );
}
