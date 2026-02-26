"use client";

import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";

interface Step {
  id: number;
  title: string;
  description: string;
  type?: "required" | "optional";
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  requiredCount?: number; // 필수 단계 수 (도구선택, 프리셋, 필수카테고리들, 추가선택)
}

export default function StepIndicator({ steps, currentStep, requiredCount = 5 }: StepIndicatorProps) {
  // 필수 단계와 선택 단계 분리
  const requiredSteps = steps.slice(0, requiredCount);
  const optionalSteps = steps.slice(requiredCount, -1); // 결과 제외
  const resultStep = steps[steps.length - 1];

  const hasOptionalSteps = optionalSteps.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* 필수 단계 */}
      <div className="flex items-center justify-between">
        {requiredSteps.map((step, index) => (
          <StepItem
            key={step.id}
            step={step}
            index={index}
            currentStep={currentStep}
            isLast={index === requiredSteps.length - 1 && !hasOptionalSteps}
            totalInRow={requiredSteps.length}
          />
        ))}

        {/* 선택 단계가 있으면 연결선 + 축소 표시 */}
        {hasOptionalSteps && (
          <>
            <div
              className={clsx("w-8 h-0.5 mx-1 transition-colors duration-300", {
                "bg-primary-400": currentStep > requiredCount,
                "bg-gray-200": currentStep <= requiredCount,
              })}
            />
            <div
              className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                {
                  "bg-primary-100 text-primary-700": currentStep > requiredCount && currentStep < steps.length,
                  "bg-gray-100 text-gray-500": currentStep <= requiredCount || currentStep >= steps.length,
                }
              )}
            >
              <span>추가 설정</span>
              <span className="bg-white px-1.5 py-0.5 rounded-full text-xs">
                {optionalSteps.length}
              </span>
            </div>
            <div
              className={clsx("w-8 h-0.5 mx-1 transition-colors duration-300", {
                "bg-primary-400": currentStep >= steps.length,
                "bg-gray-200": currentStep < steps.length,
              })}
            />
          </>
        )}

        {/* 결과 단계 */}
        <StepItem
          step={resultStep}
          index={steps.length - 1}
          currentStep={currentStep}
          isLast={true}
          totalInRow={1}
        />
      </div>

      {/* 선택 단계 상세 (현재 선택 단계 진행 중일 때만 표시) */}
      {hasOptionalSteps && currentStep > requiredCount && currentStep < steps.length && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <ChevronDown className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">추가 설정 진행 상황</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {optionalSteps.map((step, index) => {
              const actualIndex = requiredCount + index;
              const isActive = currentStep === actualIndex + 1;
              const isCompleted = currentStep > actualIndex + 1;

              return (
                <div
                  key={step.id}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all",
                    {
                      "bg-primary-50 text-primary-700 font-medium": isActive,
                      "bg-gray-50 text-gray-500": !isActive && !isCompleted,
                      "bg-green-50 text-green-700": isCompleted,
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span
                      className={clsx(
                        "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                        {
                          "bg-primary-500 text-white": isActive,
                          "bg-gray-200 text-gray-500": !isActive,
                        }
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                  <span>{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface StepItemProps {
  step: Step;
  index: number;
  currentStep: number;
  isLast: boolean;
  totalInRow: number;
}

function StepItem({ step, index, currentStep, isLast, totalInRow }: StepItemProps) {
  const stepNumber = step.id;
  const isActive = currentStep === stepNumber;
  const isCompleted = currentStep > stepNumber;

  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
            {
              "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30":
                isActive,
              "bg-primary-100 text-primary-600": isCompleted,
              "bg-gray-100 text-gray-400": !isActive && !isCompleted,
            }
          )}
        >
          {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
        </div>
        <span
          className={clsx(
            "mt-2 text-xs font-medium whitespace-nowrap transition-colors",
            {
              "text-primary-600": isActive,
              "text-gray-600": isCompleted,
              "text-gray-400": !isActive && !isCompleted,
            }
          )}
        >
          {step.title}
        </span>
      </div>

      {!isLast && (
        <div
          className={clsx("w-12 h-0.5 mx-2 transition-colors duration-300", {
            "bg-primary-400": isCompleted,
            "bg-gray-200": !isCompleted,
          })}
        />
      )}
    </div>
  );
}
