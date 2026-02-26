"use client";

import { useState } from "react";
import { Copy, Check, Download, FileText } from "lucide-react";
import clsx from "clsx";
import { GeneratedFile } from "@/types";

interface PreviewPanelProps {
  files: GeneratedFile[];
  onCopy: (content: string, fileId: string) => void;
  onDownload: (fileName: string, content: string) => void;
  copiedId: string | null;
}

export default function PreviewPanel({ files, onCopy, onDownload, copiedId }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState(files[0]?.toolId || "");

  const activeFile = files.find((f) => f.toolId === activeTab);

  if (files.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-gray-500">생성된 파일이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
        {files.map((file) => (
          <button
            key={file.toolId}
            onClick={() => setActiveTab(file.toolId)}
            className={clsx(
              "flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
              {
                "border-primary-500 text-primary-600 bg-white": activeTab === file.toolId,
                "border-transparent text-gray-500 hover:text-gray-700": activeTab !== file.toolId,
              }
            )}
          >
            <FileText className="w-4 h-4" />
            {file.toolName}
          </button>
        ))}
      </div>

      {/* 컨텐츠 영역 */}
      {activeFile && (
        <div className="animate-fade-in">
          {/* 파일 정보 & 액션 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-mono text-gray-600">
                {activeFile.fileName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onCopy(activeFile.content, activeFile.toolId)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {copiedId === activeFile.toolId ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    복사
                  </>
                )}
              </button>
              <button
                onClick={() => onDownload(activeFile.fileName, activeFile.content)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                다운로드
              </button>
            </div>
          </div>

          {/* 프리뷰 */}
          <div className="p-6 max-h-[500px] overflow-auto bg-slate-900">
            <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
              {activeFile.content}
            </pre>
          </div>
        </div>
      )}

      {/* 전체 다운로드 */}
      {files.length > 1 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
          <button
            onClick={() => {
              files.forEach((file) => onDownload(file.fileName, file.content));
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-medium hover:from-accent-600 hover:to-accent-700 transition-all shadow-lg shadow-accent-500/25"
          >
            <Download className="w-5 h-5" />
            전체 다운로드 ({files.length}개 파일)
          </button>
        </div>
      )}
    </div>
  );
}
