package com.aicontext.generate.service;

import com.aicontext.generate.dto.GenerateRequest;
import com.aicontext.generate.dto.GenerateResponse;
import com.aicontext.generate.dto.GenerateResponse.GeneratedFile;
import com.samskivert.mustache.Mustache;
import com.samskivert.mustache.Template;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * AI 도구별 컨텍스트 파일 생성 서비스
 */
@Service
@Slf4j
public class GenerateService {

    // AI 도구 정보 (도구명, 출력 파일명)
    private static final Map<String, ToolInfo> TOOL_INFO = Map.of(
            "claude-code", new ToolInfo("Claude Code", "CLAUDE.md"),
            "cursor", new ToolInfo("Cursor", ".cursorrules"),
            "github-copilot", new ToolInfo("GitHub Copilot", ".github/copilot-instructions.md"),
            "windsurf", new ToolInfo("Windsurf", ".windsurfrules"),
            "aider", new ToolInfo("Aider", ".aider.conf.yml"),
            "cline", new ToolInfo("Cline", ".clinerules")
    );

    /**
     * 선택된 AI 도구들에 대한 컨텍스트 파일 생성
     * @param request 생성 요청 (대상 도구, 옵션 설정값)
     * @return 생성된 파일 목록
     */
    public GenerateResponse generate(GenerateRequest request) {
        log.info("[Generate] Request received: targetTools={}", request.getTargetTools());
        log.debug("[Generate] project={}", request.getProject());
        log.debug("[Generate] architecture={}", request.getArchitecture());
        log.debug("[Generate] dataLayer={}", request.getDataLayer());
        log.debug("[Generate] codeStyle={}", request.getCodeStyle());
        log.debug("[Generate] testing={}", request.getTesting());
        log.debug("[Generate] git={}", request.getGit());
        log.debug("[Generate] aiTool={}", request.getAiTool());

        Map<String, Object> context = buildContext(request);
        log.debug("[Generate] Built context: {}", context);
        List<GeneratedFile> files = new ArrayList<>();

        for (String toolId : request.getTargetTools()) {
            ToolInfo toolInfo = TOOL_INFO.get(toolId);
            if (toolInfo == null) {
                log.warn("[파일 생성 스킵] 알 수 없는 도구 ID: {}", toolId);
                continue;
            }

            String content = renderTemplate(toolId, context);
            files.add(GeneratedFile.builder()
                    .toolId(toolId)
                    .toolName(toolInfo.name())
                    .fileName(toolInfo.fileName())
                    .content(content)
                    .build());
        }

        return GenerateResponse.builder()
                .files(files)
                .build();
    }

    /**
     * 요청 데이터를 Mustache 템플릿 컨텍스트로 변환
     */
    private Map<String, Object> buildContext(GenerateRequest request) {
        Map<String, Object> context = new HashMap<>();

        if (request.getProject() != null) {
            context.put("project", request.getProject());
        }
        if (request.getArchitecture() != null) {
            context.put("architecture", request.getArchitecture());
        }
        if (request.getDataLayer() != null) {
            Map<String, Object> dataLayer = new HashMap<>(request.getDataLayer());
            // QueryDSL 사용 여부 플래그 추가
            Object queryStrategy = dataLayer.get("complexQueryStrategy");
            if (queryStrategy != null) {
                String strategy = queryStrategy.toString();
                dataLayer.put("useQueryDsl", strategy.contains("querydsl"));
                dataLayer.put("useNativeQuery", strategy.contains("native"));
            }
            context.put("dataLayer", dataLayer);
        }
        if (request.getCodeStyle() != null) {
            context.put("codeStyle", request.getCodeStyle());
        }
        if (request.getTesting() != null) {
            context.put("testing", request.getTesting());
        }
        if (request.getGit() != null) {
            context.put("git", request.getGit());
        }
        if (request.getAiTool() != null) {
            context.put("aiTool", request.getAiTool());
        }

        return context;
    }

    /**
     * Mustache 템플릿을 렌더링하여 최종 컨텐츠 생성
     */
    private String renderTemplate(String toolId, Map<String, Object> context) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + toolId + ".mustache");
            Template template = Mustache.compiler()
                    .escapeHTML(false)
                    .defaultValue("")  // 누락된 필드는 빈 문자열로 처리
                    .nullValue("")     // null 값도 빈 문자열로 처리
                    .compile(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8));
            return template.execute(context);
        } catch (Exception e) {
            log.error("[템플릿 렌더링 실패] 도구: {}", toolId, e);
            return "# " + toolId + " 컨텐츠 생성 중 오류 발생";
        }
    }

    private record ToolInfo(String name, String fileName) {}
}
