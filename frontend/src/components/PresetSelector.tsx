"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { Preset } from "@/types";
import CategoryIcon from "./CategoryIcon";

interface PresetSelectorProps {
  presets: Preset[];
  selectedPreset: string | null;
  onSelect: (preset: Preset) => void;
}

export default function PresetSelector({ presets, selectedPreset, onSelect }: PresetSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">프리셋을 선택하세요</h2>
        <p className="mt-2 text-gray-500">빠르게 시작하거나 직접 설정할 수 있습니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          const isCustom = preset.id === "custom";
          const isDisabled = preset.disabled;

          return (
            <button
              key={preset.id}
              onClick={() => !isDisabled && onSelect(preset)}
              disabled={isDisabled}
              className={clsx(
                "relative p-6 rounded-xl border-2 text-left transition-all duration-200",
                {
                  "border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10": isSelected && !isDisabled,
                  "border-gray-200 hover:border-gray-300 hover:shadow-md hover:scale-[1.02]": !isSelected && !isDisabled,
                  "border-dashed": isCustom && !isDisabled,
                  "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed": isDisabled,
                }
              )}
            >
              {/* 선택 체크 */}
              {isSelected && !isDisabled && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Coming Soon 배지 */}
              {isDisabled && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-gray-200 text-gray-500 text-xs font-medium rounded-full">
                  Coming Soon
                </div>
              )}

              {/* 아이콘 */}
              <div className="mb-4">
                <CategoryIcon
                  name={preset.icon}
                  size="lg"
                  variant="gradient"
                  gradientClass={isDisabled ? "from-gray-300 to-gray-400" : preset.color}
                />
              </div>

              {/* 정보 */}
              <h3 className={clsx("font-semibold", isDisabled ? "text-gray-400" : "text-gray-900")}>{preset.name}</h3>
              <p className={clsx("text-sm mt-1", isDisabled ? "text-gray-400" : "text-gray-500")}>{preset.description}</p>

              {/* 포함 카테고리 */}
              {preset.categories.length > 0 && !isDisabled && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {preset.categories.slice(0, 4).map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                  {preset.categories.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{preset.categories.length - 4}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
