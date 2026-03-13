# CashMan Backend

iOS 가계부 앱 **CashMan**의 백엔드 API 서버입니다.

## Tech Stack

| 분류 | 기술 |
|------|------|
| Runtime | Node.js (ES Module) |
| Language | TypeScript 5.x |
| Framework | Express 5.x |
| ORM | Prisma 7.x (MariaDB Adapter) |
| Database | MySQL / MariaDB |
| Cache | Redis |
| Auth | Passport + JWT, OAuth 2.0 (Naver) |
| Validation | AJV |
| Logging | Winston + Morgan |
| API Docs | Swagger UI |
| ID Generation | ULID |

## 프로젝트 구조

```
├── config/
│   ├── config.ts                  # 환경 변수 및 앱 설정
│   └── db.config.ts               # Prisma 클라이언트 초기화
├── prisma/
│   ├── schema.prisma              # DB 스키마 정의
│   ├── generated/                 # Prisma 자동 생성
│   └── migrations/                # 마이그레이션 파일
├── src/
│   ├── server.ts                  # 엔트리포인트
│   ├── app.ts                     # Express 앱 & 미들웨어 설정
│   ├── common/
│   │   ├── auth/                  # JWT, Passport, OAuth
│   │   ├── CustomResponse.ts      # 표준 응답/에러 포맷
│   │   └── type.ts                # 공유 타입
│   ├── features/
│   │   ├── auth/                  # 인증 (네이버 OAuth, JWT)
│   │   ├── users/                 # 사용자
│   │   └── accounts/              # 계좌
│   └── libs/
│       ├── ajv.ts                 # AJV 검증
│       ├── logger.ts              # Winston 로거
│       ├── model.ts               # DB 초기화
│       ├── redis.ts               # Redis 클라이언트
│       └── swagger.ts             # Swagger 스펙 생성
└── .env                           # 환경 변수
```

### Feature 모듈 구조

```
Router → Controller → Service → Repository → Prisma (DB)
```

각 Feature 모듈은 `src/features/` 아래에 위치하며, 다음 파일들로 구성됩니다:

| 파일 | 역할              |
|------|-----------------|
| `*.router.ts` | 라우트 정의          |
| `*.controller.ts` | 요청 처리           |
| `*.service.ts` | 비즈니스 로직         |
| `*.repository.ts` | 데이터 접근 (Prisma) |
| `*.dto.ts` | AJV 기반 입출력 검증   |
| `*.swagger.ts` | OpenAPI 문서 정의   |
| `*.converter.ts` | 응답 형식 래퍼        |

## 실행 명령어

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# DB 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

## License

- Author: 최현우 (Choi Hyeonwoo)
- License: ISC
