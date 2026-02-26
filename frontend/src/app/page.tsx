"use client";

import { useState, useEffect } from "react";
import { Sparkles, Download, Copy, Check, ChevronRight, ChevronLeft } from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import OptionCard from "@/components/OptionCard";
import ToolSelector from "@/components/ToolSelector";
import PreviewPanel from "@/components/PreviewPanel";
import { fetchOptions, generateContext } from "@/lib/api";
import { OptionData, GeneratedFile } from "@/types";

const STEPS = [
  { id: 1, title: "AI 도구 선택", description: "사용할 AI 코딩 도구를 선택하세요" },
  { id: 2, title: "프로젝트 설정", description: "프로젝트 기본 정보를 입력하세요" },
  { id: 3, title: "아키텍처", description: "프로젝트 구조를 설정하세요" },
  { id: 4, title: "데이터 레이어", description: "데이터베이스와 ORM을 선택하세요" },
  { id: 5, title: "코드 스타일", description: "코딩 컨벤션을 설정하세요" },
  { id: 6, title: "테스트", description: "테스트 전략을 설정하세요" },
  { id: 7, title: "Git", description: "Git 워크플로우를 설정하세요" },
  { id: 8, title: "결과 확인", description: "생성된 파일을 확인하세요" },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selections, setSelections] = useState<Record<string, Record<string, any>>>({});
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchOptions().then(setOptions).catch(console.error);
  }, []);

  const handleSelectionChange = (optionId: string, fieldId: string, value: any) => {
    setSelections((prev) => ({
      ...prev,
      [optionId]: {
        ...prev[optionId],
        [fieldId]: value,
      },
    }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateContext({
        targetTools: selectedTools,
        project: selections.project,
        architecture: selections.architecture,
        dataLayer: selections.dataLayer,
        codeStyle: selections.codeStyle,
        testing: selections.testing,
        git: selections.git,
        aiTool: { ...selections.aiTool, targetTools: selectedTools },
      });
      setGeneratedFiles(result.files);
      setCurrentStep(8);
    } catch (error) {
      console.error("생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (content: string, fileId: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(fileId);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getOptionForStep = (step: number): OptionData | undefined => {
    const optionIds = ["", "", "project", "architecture", "dataLayer", "codeStyle", "testing", "git"];
    return options.find((o) => o.id === optionIds[step]);
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedTools.length > 0;
    return true;
  };

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
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* 메인 컨텐츠 */}
        <div className="mt-8 animate-fade-in">
          {/* Step 1: AI 도구 선택 */}
          {currentStep === 1 && (
            <ToolSelector
              selectedTools={selectedTools}
              onSelectionChange={setSelectedTools}
            />
          )}

          {/* Step 2-7: 옵션 선택 */}
          {currentStep >= 2 && currentStep <= 7 && (
            <OptionCard
              option={getOptionForStep(currentStep)}
              selections={selections[getOptionForStep(currentStep)?.id || ""] || {}}
              onSelectionChange={(fieldId, value) =>
                handleSelectionChange(getOptionForStep(currentStep)?.id || "", fieldId, value)
              }
            />
          )}

          {/* Step 8: 결과 확인 */}
          {currentStep === 8 && (
            <PreviewPanel
              files={generatedFiles}
              onCopy={handleCopy}
              onDownload={handleDownload}
              copiedId={copied}
            />
          )}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            이전
          </button>

          {currentStep < 7 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/25"
            >
              다음
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : currentStep === 7 ? (
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-medium hover:from-accent-600 hover:to-accent-700 disabled:opacity-50 transition-all shadow-lg shadow-accent-500/25"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  파일 생성
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}
