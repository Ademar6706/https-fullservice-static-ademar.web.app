import { MainForm } from "@/components/taller-track/main-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListOrdered } from "lucide-react";


export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mb-6 flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">
          Recepción de Vehículos
        </h1>
        <p className="text-lg text-muted-foreground">
          Full Service · Liqui Moly México
        </p>
      </header>
      <main className="w-full flex-grow flex justify-center">
        <Card className="w-full max-w-4xl shadow-2xl print-container">
          <MainForm />
        </Card>
      </main>
      <footer className="w-full max-w-4xl mt-6 flex justify-end">
        <Button asChild variant="outline">
          <Link href="/orders">
            <ListOrdered className="mr-2 h-4 w-4" />
            Ver Órdenes de Servicio
          </Link>
        </Button>
      </footer>
    </div>
  );
}
