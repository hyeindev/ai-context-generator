"use client";

import { Check } from "lucide-react";
import clsx from "clsx";

interface Tool {
  id: string;
  name: string;
  description: string;
  fileName: string;
  color: string;
  icon: string;
}

const TOOLS: Tool[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    description: "Anthropic Claude CLI 도구",
    fileName: "CLAUDE.md",
    color: "from-orange-400 to-orange-600",
    icon: "🤖",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Cursor AI IDE",
    fileName: ".cursorrules",
    color: "from-purple-400 to-purple-600",
    icon: "⚡",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "GitHub Copilot 지침",
    fileName: ".github/copilot-instructions.md",
    color: "from-gray-600 to-gray-800",
    icon: "🐙",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "Codeium Windsurf IDE",
    fileName: ".windsurfrules",
    color: "from-cyan-400 to-cyan-600",
    icon: "🏄",
  },
  {
    id: "cline",
    name: "Cline",
    description: "VSCode Cline 확장",
    fileName: ".clinerules",
    color: "from-green-400 to-green-600",
    icon: "🔌",
  },
  {
    id: "aider",
    name: "Aider",
    description: "Aider AI 페어 프로그래밍",
    fileName: ".aider.conf.yml",
    color: "from-blue-400 to-blue-600",
    icon: "👥",
  },
];

interface ToolSelectorProps {
  selectedTools: string[];
  onSelectionChange: (tools: string[]) => void;
}

export default function ToolSelector({ selectedTools, onSelectionChange }: ToolSelectorProps) {
  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onSelectionChange(selectedTools.filter((id) => id !== toolId));
    } else {
      onSelectionChange([...selectedTools, toolId]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">사용할 AI 도구를 선택하세요</h2>
        <p className="mt-2 text-gray-500">여러 도구를 동시에 선택할 수 있습니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const isSelected = selectedTools.includes(tool.id);
          return (
            <button
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={clsx(
                "relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02]",
                {
                  "border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10": isSelected,
                  "border-gray-200 hover:border-gray-300 hover:shadow-md": !isSelected,
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
                  tool.color
                )}
              >
                {tool.icon}
              </div>

              {/* 정보 */}
              <h3 className="font-semibold text-gray-900">{tool.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{tool.description}</p>
              <p className="text-xs text-gray-400 mt-2 font-mono">{tool.fileName}</p>
            </button>
          );
        })}
      </div>

      {selectedTools.length > 0 && (
        <div className="mt-6 p-4 bg-primary-50 rounded-xl text-center">
          <span className="text-primary-700 font-medium">
            {selectedTools.length}개 도구 선택됨
          </span>
        </div>
      )}
    </div>
  );
}
