package com.aicontext.generate.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

/**
 * 컨텍스트 파일 생성 요청 DTO
 */
@Getter
@Setter
public class GenerateRequest {

    /** 대상 AI 도구 ID 목록 (필수) */
    @NotEmpty(message = "대상 도구를 1개 이상 선택해야 합니다")
    private List<String> targetTools;

    /** 프로젝트 기본 설정 */
    private Map<String, Object> project;

    /** 아키텍처 설정 */
    private Map<String, Object> architecture;

    /** 데이터 레이어 설정 */
    private Map<String, Object> dataLayer;

    /** 코드 스타일 설정 */
    private Map<String, Object> codeStyle;

    /** 테스트 설정 */
    private Map<String, Object> testing;

    /** Git 설정 */
    private Map<String, Object> git;

    /** AI 도구 설정 */
    private Map<String, Object> aiTool;
}
