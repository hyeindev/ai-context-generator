package com.aicontext.generate.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 컨텍스트 파일 생성 응답 DTO
 */
@Getter
@Builder
public class GenerateResponse {

    /** 생성된 파일 목록 */
    private List<GeneratedFile> files;

    /**
     * 생성된 개별 파일 정보
     */
    @Getter
    @Builder
    public static class GeneratedFile {
        /** AI 도구 ID */
        private String toolId;

        /** AI 도구 표시명 */
        private String toolName;

        /** 출력 파일명 */
        private String fileName;

        /** 파일 내용 */
        private String content;
    }
}
