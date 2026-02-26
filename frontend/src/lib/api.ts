import { OptionData, GenerateRequest, GenerateResponse } from "@/types";

const API_BASE = "http://localhost:8080/api";

/**
 * 전체 옵션 목록 조회
 */
export async function fetchOptions(): Promise<OptionData[]> {
  const response = await fetch(`${API_BASE}/options`);
  if (!response.ok) {
    throw new Error("옵션 로드 실패");
  }
  return response.json();
}

/**
 * 개별 옵션 조회
 */
export async function fetchOption(optionId: string): Promise<OptionData> {
  const response = await fetch(`${API_BASE}/options/${optionId}`);
  if (!response.ok) {
    throw new Error("옵션 로드 실패");
  }
  return response.json();
}

/**
 * 컨텍스트 파일 생성
 */
export async function generateContext(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    throw new Error("생성 실패");
  }
  return response.json();
}
