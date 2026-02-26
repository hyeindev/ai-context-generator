"use client";

import { Check } from "lucide-react";
import clsx from "clsx";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-max">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* 스텝 원형 */}
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
                  {
                    "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30":
                      currentStep === step.id,
                    "bg-primary-100 text-primary-600": currentStep > step.id,
                    "bg-gray-100 text-gray-400": currentStep < step.id,
                  }
                )}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={clsx(
                  "mt-2 text-xs font-medium whitespace-nowrap transition-colors",
                  {
                    "text-primary-600": currentStep === step.id,
                    "text-gray-600": currentStep > step.id,
                    "text-gray-400": currentStep < step.id,
                  }
                )}
              >
                {step.title}
              </span>
            </div>

            {/* 연결선 */}
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "w-12 h-0.5 mx-2 transition-colors duration-300",
                  {
                    "bg-primary-400": currentStep > step.id,
                    "bg-gray-200": currentStep <= step.id,
                  }
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
