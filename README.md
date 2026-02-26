# AI Context Generator

AI 코딩 도구를 위한 프로젝트 컨텍스트 파일 생성기입니다.

프로젝트의 기술 스택, 아키텍처, 코딩 컨벤션을 설정하면 각 AI 도구에 맞는 컨텍스트 파일을 자동으로 생성합니다.

## 지원 AI 도구

| 도구 | 생성 파일 | 상태 |
|------|-----------|------|
| Claude Code | `CLAUDE.md` | 지원 |
| Cursor | `.cursorrules` | Coming Soon |
| GitHub Copilot | `.github/copilot-instructions.md` | Coming Soon |
| Windsurf | `.windsurfrules` | Coming Soon |
| Cline | `.clinerules` | Coming Soon |
| Aider | `.aider.conf.yml` | Coming Soon |

## 기술 스택

### Backend
- Java 17
- Spring Boot 3.2.2
- JMustache (템플릿 엔진)
- Gradle

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (아이콘)

## 시작하기

### 요구사항
- Java 17+
- Node.js 18+
- pnpm (권장) 또는 npm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/ai-context-generator.git
cd ai-context-generator

# 백엔드 실행
./gradlew :backend:bootRun

# 프론트엔드 실행 (새 터미널)
cd frontend
pnpm install
pnpm dev
```

브라우저에서 http://localhost:3000 접속

## 사용 방법

1. **프리셋 선택**: Spring Boot 기본, Spring + JPA 표준, Hexagonal + DDD 등 사전 정의된 설정 선택
2. **AI 도구 선택**: 생성할 컨텍스트 파일의 대상 AI 도구 선택
3. **추가 설정** (선택): 데이터 레이어, 코드 스타일, 테스트, Git 등 세부 옵션 커스터마이징
4. **생성**: 설정에 맞는 컨텍스트 파일 생성 및 다운로드

## 프리셋

| 프리셋 | 설명 |
|--------|------|
| Spring Boot 기본 | Spring Boot 입문자를 위한 기본 설정 |
| Spring + JPA 표준 | 실무에서 많이 쓰는 JPA 프로젝트 표준 설정 |
| Hexagonal + DDD | 도메인 중심 설계, 클린 아키텍처 |
| Next.js 풀스택 | Next.js App Router 기반 풀스택 (Coming Soon) |
| Kotlin + Spring | Kotlin 기반 Spring Boot 프로젝트 (Coming Soon) |

## 설정 카테고리

### 필수 항목
- **프로젝트 기본**: 언어, 프레임워크, 빌드 도구
- **아키텍처**: 프로젝트 구조 및 패턴
- **AI 응답 설정**: 응답 언어, 스타일, 제한사항

### 선택 항목
- **데이터 레이어**: DB, ORM, 쿼리 전략
- **코드 스타일**: 네이밍 컨벤션, 패키지 구조
- **테스트**: 테스트 프레임워크, 네이밍
- **Git**: 브랜치 전략, 커밋 컨벤션
- **보안**: 인증, 권한, 보안 정책
- **예외 처리**: 에러 코드, 예외 계층
- **API 설계**: 응답 포맷, 페이지네이션
- **도메인 설계**: 엔티티, VO, 연관관계

## 프로젝트 구조

```
ai-context-generator/
├── backend/
│   └── src/main/
│       ├── java/com/aicontext/
│       │   ├── generate/          # 컨텍스트 파일 생성
│       │   └── option/            # 옵션 데이터 관리
│       └── resources/
│           ├── options/           # 옵션 JSON 설정
│           └── templates/         # Mustache 템플릿
├── frontend/
│   └── src/
│       ├── app/                   # Next.js App Router
│       ├── components/            # React 컴포넌트
│       ├── lib/                   # API 클라이언트
│       └── types/                 # TypeScript 타입
└── README.md
```


## 라이선스

MIT License
