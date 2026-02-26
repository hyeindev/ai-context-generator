"use client";

import { useState, useEffect, useMemo } from "react";
import { Sparkles, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import OptionCard from "@/components/OptionCard";
import ToolSelector from "@/components/ToolSelector";
import PresetSelector from "@/components/PresetSelector";
import CategorySelector from "@/components/CategorySelector";
import PreviewPanel from "@/components/PreviewPanel";
import { fetchOptions, fetchCategories, fetchPresets, generateContext } from "@/lib/api";
import { OptionData, GeneratedFile, CategoriesData, PresetsData, Preset } from "@/types";

type FlowStep =
  | "tool-select"
  | "preset-select"
  | "required-options"
  | "optional-select"
  | "optional-options"
  | "result";

export default function Home() {
  // 데이터 상태
  const [options, setOptions] = useState<OptionData[]>([]);
  const [categories, setCategories] = useState<CategoriesData | null>(null);
  const [presets, setPresets] = useState<PresetsData | null>(null);

  // 선택 상태
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [selectedOptionalCategories, setSelectedOptionalCategories] = useState<string[]>([]);
  const [selections, setSelections] = useState<Record<string, Record<string, any>>>({});

  // 플로우 상태
  const [currentFlow, setCurrentFlow] = useState<FlowStep>("tool-select");
  const [currentRequiredIndex, setCurrentRequiredIndex] = useState(0);
  const [currentOptionalIndex, setCurrentOptionalIndex] = useState(0);

  // 결과 상태
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    Promise.all([fetchOptions(), fetchCategories(), fetchPresets()])
      .then(([opts, cats, pres]) => {
        setOptions(opts);
        setCategories(cats);
        setPresets(pres);
      })
      .catch(console.error);
  }, []);

  // 필수 카테고리 ID 목록
  const requiredCategoryIds = useMemo(
    () => categories?.required.map((c) => c.id) || [],
    [categories]
  );

  // 현재 설정할 옵션 카테고리들
  const optionalCategoryIds = selectedOptionalCategories;

  // 스텝 계산
  const steps = useMemo(() => {
    const result = [
      { id: "tool-select", title: "AI 도구", description: "사용할 AI 도구 선택" },
      { id: "preset-select", title: "프리셋", description: "빠른 시작 또는 직접 설정" },
    ];

    // 필수 카테고리 스텝
    categories?.required.forEach((cat) => {
      result.push({
        id: `required-${cat.id}`,
        title: cat.title,
        description: cat.description,
      });
    });

    // 추가 카테고리 선택 스텝
    result.push({
      id: "optional-select",
      title: "추가 설정",
      description: "추가로 설정할 항목 선택",
    });

    // 선택한 추가 카테고리 스텝
    selectedOptionalCategories.forEach((catId) => {
      const cat = categories?.optional.find((c) => c.id === catId);
      if (cat) {
        result.push({
          id: `optional-${cat.id}`,
          title: cat.title,
          description: cat.description,
        });
      }
    });

    result.push({ id: "result", title: "결과", description: "생성된 파일 확인" });

    return result;
  }, [categories, selectedOptionalCategories]);

  // 현재 스텝 인덱스
  const currentStepIndex = useMemo(() => {
    switch (currentFlow) {
      case "tool-select":
        return 0;
      case "preset-select":
        return 1;
      case "required-options":
        return 2 + currentRequiredIndex;
      case "optional-select":
        return 2 + requiredCategoryIds.length;
      case "optional-options":
        return 2 + requiredCategoryIds.length + 1 + currentOptionalIndex;
      case "result":
        return steps.length - 1;
      default:
        return 0;
    }
  }, [currentFlow, currentRequiredIndex, currentOptionalIndex, requiredCategoryIds.length, steps.length]);

  // 프리셋 선택 핸들러
  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    if (preset.id !== "custom") {
      // 프리셋 값 적용
      setSelections(preset.values);
      // 프리셋에 포함된 선택 카테고리 자동 선택
      const optionalInPreset = preset.categories.filter(
        (c) => !requiredCategoryIds.includes(c)
      );
      setSelectedOptionalCategories(optionalInPreset);
    } else {
      setSelections({});
      setSelectedOptionalCategories([]);
    }
  };

  // 옵션 변경 핸들러
  const handleSelectionChange = (optionId: string, fieldId: string, value: any) => {
    setSelections((prev) => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        [fieldId]: value,
      },
    }));
  };

  // 생성 핸들러
  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateContext({
        targetTools: selectedTools,
        ...selections,
        aiTool: { ...selections.aiTool, targetTools: selectedTools },
      });
      setGeneratedFiles(result.files);
      setCurrentFlow("result");
    } catch (error) {
      console.error("생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 복사 핸들러
  const handleCopy = async (content: string, fileId: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(fileId);
    setTimeout(() => setCopied(null), 2000);
  };

  // 다운로드 핸들러
  const handleDownload = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 다음 버튼 핸들러
  const handleNext = () => {
    switch (currentFlow) {
      case "tool-select":
        setCurrentFlow("preset-select");
        break;
      case "preset-select":
        setCurrentRequiredIndex(0);
        setCurrentFlow("required-options");
        break;
      case "required-options":
        if (currentRequiredIndex < requiredCategoryIds.length - 1) {
          setCurrentRequiredIndex((i) => i + 1);
        } else {
          setCurrentFlow("optional-select");
        }
        break;
      case "optional-select":
        if (selectedOptionalCategories.length > 0) {
          setCurrentOptionalIndex(0);
          setCurrentFlow("optional-options");
        } else {
          handleGenerate();
        }
        break;
      case "optional-options":
        if (currentOptionalIndex < selectedOptionalCategories.length - 1) {
          setCurrentOptionalIndex((i) => i + 1);
        } else {
          handleGenerate();
        }
        break;
    }
  };

  // 이전 버튼 핸들러
  const handlePrev = () => {
    switch (currentFlow) {
      case "preset-select":
        setCurrentFlow("tool-select");
        break;
      case "required-options":
        if (currentRequiredIndex > 0) {
          setCurrentRequiredIndex((i) => i - 1);
        } else {
          setCurrentFlow("preset-select");
        }
        break;
      case "optional-select":
        setCurrentRequiredIndex(requiredCategoryIds.length - 1);
        setCurrentFlow("required-options");
        break;
      case "optional-options":
        if (currentOptionalIndex > 0) {
          setCurrentOptionalIndex((i) => i - 1);
        } else {
          setCurrentFlow("optional-select");
        }
        break;
      case "result":
        if (selectedOptionalCategories.length > 0) {
          setCurrentOptionalIndex(selectedOptionalCategories.length - 1);
          setCurrentFlow("optional-options");
        } else {
          setCurrentFlow("optional-select");
        }
        break;
    }
  };

  // 현재 옵션 데이터 가져오기
  const getCurrentOption = (): OptionData | undefined => {
    if (currentFlow === "required-options") {
      const catId = requiredCategoryIds[currentRequiredIndex];
      return options.find((o) => o.id === catId);
    }
    if (currentFlow === "optional-options") {
      const catId = selectedOptionalCategories[currentOptionalIndex];
      return options.find((o) => o.id === catId);
    }
    return undefined;
  };

  // 다음 버튼 활성화 여부
  const canProceed = () => {
    if (currentFlow === "tool-select") return selectedTools.length > 0;
    if (currentFlow === "preset-select") return selectedPreset !== null;
    return true;
  };

  // 다음 버튼 텍스트
  const getNextButtonText = () => {
    if (currentFlow === "optional-select" && selectedOptionalCategories.length === 0) {
      return "바로 생성";
    }
    if (
      (currentFlow === "optional-select" && selectedOptionalCategories.length > 0) ||
      (currentFlow === "optional-options" &&
        currentOptionalIndex === selectedOptionalCategories.length - 1)
    ) {
      return "파일 생성";
    }
    return "다음";
  };

  const isGenerateButton =
    (currentFlow === "optional-select" && selectedOptionalCategories.length === 0) ||
    (currentFlow === "optional-options" &&
      currentOptionalIndex === selectedOptionalCategories.length - 1);

  return (
    <main className="min-h-screen">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Context Generator</h1>
              <p className="text-sm text-gray-500">CLAUDE.md, .cursorrules 등 AI 코딩 도구 설정 파일 생성</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 스텝 인디케이터 */}
        <StepIndicator
          steps={steps.map((s, i) => ({ id: i + 1, title: s.title, description: s.description }))}
          currentStep={currentStepIndex + 1}
          requiredCount={2 + requiredCategoryIds.length + 1} // 도구선택 + 프리셋 + 필수카테고리들 + 추가선택
        />

        {/* 메인 컨텐츠 */}
        <div className="mt-8 animate-fade-in">
          {/* AI 도구 선택 */}
          {currentFlow === "tool-select" && (
            <ToolSelector selectedTools={selectedTools} onSelectionChange={setSelectedTools} />
          )}

          {/* 프리셋 선택 */}
          {currentFlow === "preset-select" && presets && (
            <PresetSelector
              presets={presets.presets}
              selectedPreset={selectedPreset?.id || null}
              onSelect={handlePresetSelect}
            />
          )}

          {/* 필수 옵션 설정 */}
          {currentFlow === "required-options" && (
            <OptionCard
              option={getCurrentOption()}
              selections={selections[getCurrentOption()?.id || ""] || {}}
              onSelectionChange={(fieldId, value) =>
                handleSelectionChange(getCurrentOption()?.id || "", fieldId, value)
              }
            />
          )}

          {/* 추가 카테고리 선택 */}
          {currentFlow === "optional-select" && categories && (
            <CategorySelector
              categories={categories.optional}
              selectedCategories={selectedOptionalCategories}
              onSelectionChange={setSelectedOptionalCategories}
            />
          )}

          {/* 선택 옵션 설정 */}
          {currentFlow === "optional-options" && (
            <OptionCard
              option={getCurrentOption()}
              selections={selections[getCurrentOption()?.id || ""] || {}}
              onSelectionChange={(fieldId, value) =>
                handleSelectionChange(getCurrentOption()?.id || "", fieldId, value)
              }
            />
          )}

          {/* 결과 */}
          {currentFlow === "result" && (
            <PreviewPanel
              files={generatedFiles}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copiedId={copied}
            />
          )}
        </div>

        {/* 네비게이션 버튼 */}
        {currentFlow !== "result" && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentFlow === "tool-select"}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              이전
            </button>

            <button
              onClick={isGenerateButton ? handleGenerate : handleNext}
              disabled={!canProceed() || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                isGenerateButton
                  ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-accent-500/25"
                  : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-primary-500/25"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  {isGenerateButton ? <Sparkles className="w-5 h-5" /> : null}
                  {getNextButtonText()}
                  {!isGenerateButton && <ChevronRight className="w-5 h-5" />}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
