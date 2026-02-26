package com.aicontext.generate.controller;

import com.aicontext.generate.dto.GenerateRequest;
import com.aicontext.generate.dto.GenerateResponse;
import com.aicontext.generate.service.GenerateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 컨텍스트 파일 생성 API 컨트롤러
 */
@RestController
@RequestMapping("/api/generate")
@RequiredArgsConstructor
public class GenerateController {

    private final GenerateService generateService;

    /**
     * 선택한 옵션 기반으로 AI 도구별 컨텍스트 파일 생성
     * @param request 생성 요청 (대상 도구, 옵션 설정값)
     * @return 생성된 파일 목록
     */
    @PostMapping
    public ResponseEntity<GenerateResponse> generate(@Valid @RequestBody GenerateRequest request) {
        return ResponseEntity.ok(generateService.generate(request));
    }
}
