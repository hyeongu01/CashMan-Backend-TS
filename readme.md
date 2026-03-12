# TS-Express-Prisma Backend Template

TypeScript + Express + Prisma 기반 백엔드 프로젝트 템플릿입니다.
반복적인 프로젝트 초기 설정 없이 바로 기능 개발에 집중할 수 있습니다.

## Tech Stack

| 분류 | 기술 |
|------|------|
| Runtime | Node.js v25+ (ES Module) |
| Language | TypeScript 5.x (Strict Mode) |
| Framework | Express 5.x |
| ORM | Prisma 7.x (MariaDB Adapter) |
| Database | MySQL / MariaDB |
| Cache | Redis |
| Auth | Passport + JWT, OAuth 2.0 (Naver 예시 포함) |
| Validation | Zod |
| Logging | Winston |
| API Docs | Swagger UI |
| ID 생성 | ULID |

## 시작하기

### 1. 템플릿 복제

```bash
git clone https://github.com/hyeongu01/TS-Express-Prisma-Backend-Architecture.git my-project
cd my-project
rm -rf .git
git init
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성합니다.

```env
APP="development"               # development | production

# Database
DATABASE_URL="mysql://root:1234@localhost:3306/myDB"
DATABASE_HOST="localhost"
DATABASE_PORT="3306"
DATABASE_USER="root"
DATABASE_PASSWORD="1234"
DATABASE_NAME="myDB"

# Redis
REDIS_URL="redis://:@localhost:6379"

# JWT
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# OAuth (선택 - 네이버 로그인 사용 시)
NAVER_CLIENT_ID="..."
NAVER_CLIENT_SECRET="..."
NAVER_REDIRECT_URI="http://localhost:3000/auth/naver/callback"
```

### 4. DB 스키마 정의

`prisma/schema.prisma`에서 프로젝트에 맞게 모델을 정의합니다.
템플릿에는 가계부 앱 예시 스키마(user, account, transaction 등)가 포함되어 있으니 참고하거나 교체하세요.

```bash
# Prisma 클라이언트 생성
npx prisma generate

# DB 마이그레이션 적용
npx prisma migrate dev
```

### 5. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000`에서 서버가 시작됩니다.

- `GET /health` — 서버 상태 확인
- `GET /docs` — Swagger API 문서

## 프로젝트 구조

```
├── config/
│   ├── config.ts               # 환경 변수 및 앱 설정
│   └── db.config.ts            # Prisma 클라이언트 초기화
├── prisma/
│   ├── schema.prisma           # DB 스키마 정의
│   ├── generated/              # Prisma 자동 생성 (gitignore)
│   └── migrations/             # 마이그레이션 파일
├── src/
│   ├── server.ts               # 엔트리포인트 (DB, Redis 연결 & 서버 시작)
│   ├── app.ts                  # Express 앱 & 미들웨어 설정
│   ├── common/                 # 공통 유틸리티
│   │   ├── auth/               # JWT, Passport, OAuth 헬퍼
│   │   ├── CustomResponse.ts   # 표준 응답/에러 포맷
│   │   └── type.ts             # 공유 타입
│   ├── features/               # 기능별 모듈 (아래 설명)
│   └── libs/                   # 라이브러리
│       ├── logger.ts           # Winston 로거
│       ├── model.ts            # DB 초기화
│       ├── redis.ts            # Redis 클라이언트
│       └── swagger.ts          # Swagger 스펙 생성
└── .env                        # 환경 변수 (gitignore)
```

## Feature 모듈 구조

이 템플릿은 **계층형 아키텍처**를 따릅니다.

```
Router → Controller → Service → Repository → Prisma (DB)
```

각 Feature 모듈은 `src/features/` 아래에 위치하며, 다음 파일들로 구성됩니다:

| 파일 | 역할 |
|------|------|
| `*.router.ts` | 라우트 정의 |
| `*.controller.ts` | 요청 처리 |
| `*.service.ts` | 비즈니스 로직 |
| `*.repository.ts` | 데이터 접근 (Prisma) |
| `*.dto.ts` | Zod 기반 입출력 검증 |
| `*.swagger.ts` | OpenAPI 문서 정의 |

### 새 Feature 추가하기

**1단계**: `src/features/` 아래에 디렉토리 생성

```
src/features/post/
├── post.router.ts
├── post.controller.ts
├── post.service.ts
├── post.repository.ts
├── post.dto.ts
└── post.swagger.ts
```

**2단계**: `src/features/index.ts`에 라우터 등록

```typescript
import postRouter from "./post/post.router";
router.use("/post", postRouter);
```

이렇게 하면 `/post` 경로로 API가 추가됩니다.

## 템플릿에 포함된 예시

참고용으로 가계부(CashMan) 앱의 일부 기능이 구현되어 있습니다:

- **auth 모듈**: 네이버 OAuth 로그인 → 자동 회원가입 → JWT 발급 플로우
- **DB 스키마**: user, account, transaction, category 모델
- **Passport 미들웨어**: JWT Bearer 인증

이 예시들을 참고하여 본인의 프로젝트에 맞게 수정하거나 제거하세요.

## 표준 응답 형식

템플릿에 정의된 API 응답 포맷입니다.

**성공**
```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

**에러**
```json
{
  "statusCode": 400,
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "잘못된 요청입니다."
  }
}
```

| 에러 코드 | Status |
|-----------|--------|
| `BAD_REQUEST` | 400 |
| `UNAUTHORIZED` | 401 |
| `NOT_FOUND` | 404 |
| `SERVER_ERROR` | 500 |

## Path Aliases

`tsconfig.json`에 정의된 경로 별칭:

| Alias | Path |
|-------|------|
| `@config/*` | `config/*` |
| `@features/*` | `src/features/*` |
| `@generated/*` | `prisma/generated/*` |
| `@libs/*` | `src/libs/*` |
| `@common/*` | `src/common/*` |

## 로깅

Winston 기반으로 설정되어 있습니다.

- **콘솔**: 컬러 + 타임스탬프
- **파일**: `logs/error.log` (에러만), `logs/combined.log` (전체)

## License

작성자: 최현우
라이센스: ISC

> 자유롭게 사용하시고 제안사항 있으면 이메일로 연락주세요!