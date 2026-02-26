/** 옵션 데이터 타입 */
export interface OptionData {
  id: string;
  title: string;
  description: string;
  options: OptionField[];
}

/** 옵션 필드 타입 */
export interface OptionField {
  id: string;
  label: string;
  type: "select" | "multiSelect" | "boolean" | "object";
  required?: boolean;
  description?: string;
  values?: OptionValue[];
  properties?: Record<string, OptionField>;
  dependsOn?: {
    field: string;
    mapping?: Record<string, string[]>;
    showWhen?: string[];
  };
}

/** 옵션 값 타입 */
export interface OptionValue {
  id: string;
  label: string;
  description?: string;
  example?: string;
}

/** 생성된 파일 타입 */
export interface GeneratedFile {
  toolId: string;
  toolName: string;
  fileName: string;
  content: string;
}

/** 생성 요청 타입 */
export interface GenerateRequest {
  targetTools: string[];
  project?: Record<string, any>;
  architecture?: Record<string, any>;
  dataLayer?: Record<string, any>;
  codeStyle?: Record<string, any>;
  testing?: Record<string, any>;
  git?: Record<string, any>;
  aiTool?: Record<string, any>;
}

/** 생성 응답 타입 */
export interface GenerateResponse {
  files: GeneratedFile[];
}

/** 카테고리 항목 타입 */
export interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order?: number;
  recommended?: boolean;
}

/** 카테고리 데이터 타입 */
export interface CategoriesData {
  required: CategoryItem[];
  optional: CategoryItem[];
}

/** 프리셋 타입 */
export interface Preset {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  categories: string[];
  values: Record<string, Record<string, any>>;
  disabled?: boolean;
}

/** 프리셋 데이터 타입 */
export interface PresetsData {
  presets: Preset[];
}
