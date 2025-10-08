import { MainForm } from "@/components/taller-track/main-form";
import { LiquiMolyLogo, FullServiceLogo } from "@/components/icons";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary font-headline text-center">
          Recepción de Vehículos · Full Service · Liqui Moly México
        </h1>
        <div className="flex items-center gap-4 flex-shrink-0">
          <LiquiMolyLogo className="h-10 w-auto" />
          <FullServiceLogo className="h-12 w-auto" />
        </div>
      </header>
      <main className="w-full flex-grow flex justify-center">
        <Card className="w-full max-w-4xl shadow-2xl print-container">
          <MainForm />
        </Card>
      </main>
    </div>
  );
}
