package com.aicontext.option.controller;

import com.aicontext.option.service.OptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 옵션 조회 API 컨트롤러
 */
@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class OptionController {

    private final OptionService optionService;

    /**
     * 전체 옵션 목록 조회
     * @return 옵션 목록
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllOptions() {
        return ResponseEntity.ok(optionService.getAllOptions());
    }

    /**
     * 개별 옵션 조회
     * @param optionId 옵션 ID
     * @return 옵션 데이터 (없으면 404)
     */
    @GetMapping("/{optionId}")
    public ResponseEntity<Map<String, Object>> getOption(@PathVariable String optionId) {
        return optionService.getOption(optionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
