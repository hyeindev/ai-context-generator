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
 * 옵션, 카테고리, 프리셋 JSON 파일을 로드하고 관리하는 서비스
 */
@Service
@Slf4j
public class OptionService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Map<String, Object>> optionCache = new LinkedHashMap<>();
    private Map<String, Object> categoriesCache;
    private Map<String, Object> presetsCache;

    /**
     * 애플리케이션 시작 시 JSON 파일들을 로드하여 캐시에 저장
     */
    @PostConstruct
    public void loadOptions() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

            // 옵션 파일들 로드
            Resource[] resources = resolver.getResources("classpath:options/*.json");
            for (Resource resource : resources) {
                String filename = resource.getFilename();
                if (filename == null) continue;

                // categories.json, presets.json은 별도 처리
                if (filename.equals("categories.json")) {
                    categoriesCache = objectMapper.readValue(resource.getInputStream(), new TypeReference<>() {});
                    log.info("[카테고리 로드 완료]");
                    continue;
                }
                if (filename.equals("presets.json")) {
                    presetsCache = objectMapper.readValue(resource.getInputStream(), new TypeReference<>() {});
                    log.info("[프리셋 로드 완료]");
                    continue;
                }

                Map<String, Object> option = objectMapper.readValue(resource.getInputStream(), new TypeReference<>() {});
                String id = (String) option.get("id");
                if (id != null) {
                    optionCache.put(id, option);
                    log.info("[옵션 로드 완료] id={}", id);
                }
            }
        } catch (IOException e) {
            log.error("[옵션 로드 실패] 옵션 파일을 읽는 중 오류 발생", e);
            throw new RuntimeException("옵션 파일 로드 실패", e);
        }
    }

    /**
     * 전체 옵션 목록 조회
     */
    public List<Map<String, Object>> getAllOptions() {
        return new ArrayList<>(optionCache.values());
    }

    /**
     * 개별 옵션 조회
     */
    public Optional<Map<String, Object>> getOption(String optionId) {
        return Optional.ofNullable(optionCache.get(optionId));
    }

    /**
     * 카테고리 정보 조회 (필수/선택 구분)
     */
    public Map<String, Object> getCategories() {
        return categoriesCache != null ? categoriesCache : Map.of();
    }

    /**
     * 프리셋 목록 조회
     */
    public Map<String, Object> getPresets() {
        return presetsCache != null ? presetsCache : Map.of();
    }
}
