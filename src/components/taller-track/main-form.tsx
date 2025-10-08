"use client";

import { useState } from "react";
import type { FormData } from "@/lib/definitions";
import { Stepper } from "./stepper";
import Step1VehicleForm from "./step-1-vehicle-form";
import Step2Checklist from "./step-2-checklist";
import Step3Estimate from "./step-3-estimate";
import Step4Summary from "./step-4-summary";
import { CardContent } from "@/components/ui/card";

const steps = [
  { id: 1, name: "Datos del Vehículo" },
  { id: 2, name: "Checklist de Recepción" },
  { id: 3, name: "Presupuesto" },
  { id: 4, name: "Revisar y Firmar" },
];

const getInitialFormData = (): Partial<FormData> => ({
  checklist: {
    tires: "N/A",
    lights: "N/A",
    brakes: "N/A",
    liquidos: "N/A",
    bateria: "N/A",
  },
  services: [],
  discount: 0,
  folio: `FS-${Date.now().toString().slice(-6)}`,
  orderDate: new Date().toLocaleDateString("es-MX", {
    year: 'numeric', month: 'long', day: 'numeric'
  }),
  signature: "",
});

export function MainForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>(getInitialFormData());
  const [isCompleted, setIsCompleted] = useState(false);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if(step < currentStep) {
      setCurrentStep(step);
    }
  }

  const handleRestart = () => {
    setCurrentStep(1);
    setFormData(getInitialFormData());
    setIsCompleted(false);
  }


  return (
    <>
      <div className="p-6 border-b no-print">
        <Stepper steps={steps} currentStep={currentStep} goToStep={goToStep} />
      </div>

      <CardContent className="p-6 md:p-8">
        <div className="transition-all duration-300">
          {currentStep === 1 && (
            <Step1VehicleForm
              onNext={nextStep}
              updateData={updateFormData}
              data={formData}
            />
          )}
          {currentStep === 2 && (
            <Step2Checklist
              onNext={nextStep}
              onPrev={prevStep}
              updateData={updateFormData}
              data={formData.checklist || {}}
            />
          )}
          {currentStep === 3 && (
            <Step3Estimate
              onNext={nextStep}
              onPrev={prevStep}
              updateData={updateFormData}
              data={formData}
            />
          )}
          {currentStep === 4 && (
            <Step4Summary
              onPrev={prevStep}
              data={formData}
              onRestart={handleRestart}
              updateData={updateFormData}
            />
          )}
        </div>
      </CardContent>
    </>
  );
}
