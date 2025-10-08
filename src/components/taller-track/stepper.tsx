"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Step = {
  id: number;
  name: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
  goToStep: (step: number) => void;
};

export function Stepper({ steps, currentStep, goToStep }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="flex items-center"
      >
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn("relative", {
              "flex-1": stepIdx !== steps.length - 1,
            })}
          >
            {step.id < currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  {stepIdx !== steps.length - 1 && (
                    <div className="h-0.5 w-full bg-primary" />
                  )}
                </div>
                <button
                  onClick={() => goToStep(step.id)}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Check className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </button>
                 <span className="absolute -bottom-6 text-xs text-center w-max -translate-x-1/2 left-1/2 text-primary font-medium">{step.name}</span>
              </>
            ) : step.id === currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  {stepIdx !== steps.length - 1 && (
                    <div className="h-0.5 w-full bg-gray-200" />
                  )}
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
                 <span className="absolute -bottom-6 text-xs text-center w-max -translate-x-1/2 left-1/2 text-primary font-semibold">{step.name}</span>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  {stepIdx !== steps.length - 1 && (
                    <div className="h-0.5 w-full bg-gray-200" />
                  )}
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-background transition-colors">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
                <span className="absolute -bottom-6 text-xs text-center w-max -translate-x-1/2 left-1/2 text-muted-foreground">{step.name}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
