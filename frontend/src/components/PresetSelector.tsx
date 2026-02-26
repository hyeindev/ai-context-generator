"use client";

import { Check } from "lucide-react";
import clsx from "clsx";
import { Preset } from "@/types";

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

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={clsx(
                "relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02]",
                {
                  "border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10": isSelected,
                  "border-gray-200 hover:border-gray-300 hover:shadow-md": !isSelected,
                  "border-dashed": isCustom,
                }
              )}
            >
              {/* 선택 체크 */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* 아이콘 */}
              <div
                className={clsx(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl mb-4",
                  preset.color
                )}
              >
                {preset.icon}
              </div>

              {/* 정보 */}
              <h3 className="font-semibold text-gray-900">{preset.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{preset.description}</p>

              {/* 포함 카테고리 */}
              {preset.categories.length > 0 && (
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
