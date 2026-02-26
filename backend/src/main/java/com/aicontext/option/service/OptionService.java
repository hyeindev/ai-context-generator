package com.aicontext.option.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

/**
 * 옵션 JSON 파일을 로드하고 관리하는 서비스
 */
@Service
@Slf4j
public class OptionService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Map<String, Object>> optionCache = new LinkedHashMap<>();

    // 옵션 표시 순서
    private static final List<String> OPTION_ORDER = List.of(
            "project", "architecture", "dataLayer", "codeStyle", "testing", "git", "aiTool"
    );

    /**
     * 애플리케이션 시작 시 옵션 JSON 파일들을 로드하여 캐시에 저장
     */
    @PostConstruct
    public void loadOptions() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:options/*.json");

            for (Resource resource : resources) {
                Map<String, Object> option = objectMapper.readValue(
                        resource.getInputStream(),
                        new TypeReference<>() {}
                );
                String id = (String) option.get("id");
                optionCache.put(id, option);
                log.info("[옵션 로드 완료] id={}", id);
            }
        } catch (IOException e) {
            log.error("[옵션 로드 실패] 옵션 파일을 읽는 중 오류 발생", e);
            throw new RuntimeException("옵션 파일 로드 실패", e);
        }
    }

    /**
     * 전체 옵션 목록 조회 (정렬된 순서로 반환)
     */
    public List<Map<String, Object>> getAllOptions() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (String id : OPTION_ORDER) {
            if (optionCache.containsKey(id)) {
                result.add(optionCache.get(id));
            }
        }
        return result;
    }

    /**
     * 개별 옵션 조회
     * @param optionId 옵션 ID
     * @return 옵션 데이터 (없으면 Optional.empty)
     */
    public Optional<Map<String, Object>> getOption(String optionId) {
        return Optional.ofNullable(optionCache.get(optionId));
    }
}
