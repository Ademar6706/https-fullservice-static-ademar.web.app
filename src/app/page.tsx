import { MainForm } from "@/components/taller-track/main-form";
import { Card } from "@/components/ui/card";
import { LiquiMolyLogo, FullServiceLogo } from "@/components/icons";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mb-6 flex flex-col justify-center items-center text-center">
        <div className="flex items-center gap-4 mb-4">
          <LiquiMolyLogo className="h-16 w-auto" />
          <FullServiceLogo className="h-14 w-auto" />
        </div>
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
    </div>
  );
}
