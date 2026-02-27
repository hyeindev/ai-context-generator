import { OptionData, GenerateRequest, GenerateResponse, CategoriesData, PresetsData } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
 * 카테고리 정보 조회
 */
export async function fetchCategories(): Promise<CategoriesData> {
  const response = await fetch(`${API_BASE}/options/categories`);
  if (!response.ok) {
    throw new Error("카테고리 로드 실패");
  }
  return response.json();
}

/**
 * 프리셋 목록 조회
 */
export async function fetchPresets(): Promise<PresetsData> {
  const response = await fetch(`${API_BASE}/options/presets`);
  if (!response.ok) {
    throw new Error("프리셋 로드 실패");
  }
  return response.json();
}

/**
 * 컨텍스트 파일 생성
 */
export async function generateContext(request: GenerateRequest): Promise<GenerateResponse> {
  console.log("[API] Generate Request:", JSON.stringify(request, null, 2));
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
  const result = await response.json();
  console.log("[API] Generate Response:", result);
  return result;
}
