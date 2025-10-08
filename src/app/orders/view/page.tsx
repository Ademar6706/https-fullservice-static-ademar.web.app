import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import OrderViewClient from "./view-client";

export default function Page() {
  return (
    <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg">Cargando orden…</span>
            </div>
        </div>
    }>
      <OrderViewClient />
    </Suspense>
  );
}
