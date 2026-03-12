import {OpenAPIV3} from "openapi-types";

const TAG_NAME = "01. Auth";

const LOGIN_DESC = `
  소셜 로그인 API

  **Request Body**
  \`\`\`
  {
      code: "...",
      state: "...", // NAVER 식별자 코드
      deviceId: "...",
      provider: "", // NAVER, 
  }
  \`\`\`

  **Logic**
  - 클라이언트가 OAuth 인증 후 받은 code를 전달
  - 서버에서 code로 소셜 API 호출 → 유저 정보 조회
  - 계정이 없다면 새로 생성
  - deviceId가 없으면 신규 기기로 판단하여 새로 생성
 - deviceId가 있으면 기존 refreshToken 폐기 후 재발급

`;

const REFRESH_DESC = `
accessToken 재발급 API

**Request Body**
\`\`\`
{
  refreshToken: "sdfsaewf..."
}
\`\`\`

**Logic:**  
- refreshToken 유효성 검증
- deviceId 는 그대로 해서 token 재발급
`;

const authPaths: OpenAPIV3.PathsObject = {
    "/auth/login": {
        post: {
            summary: "로그인 API",
            description: LOGIN_DESC,
            tags: [TAG_NAME],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                code: {type: "string", description: "OAuth 인증 코드"},
                                state: {type: "string", description: "[naver] 인증 상태"},
                                provider: {type: "string", enum: ["NAVER"], description: "소셜 로그인 제공자"},
                                deviceId: {type: "string", description: "기기 식별자 (없으면 신규 기기)"},
                            },
                            required: ["code", "provider", "deviceId"],
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {type: "boolean"},
                                    data: {
                                        type: "object",
                                        properties: {
                                            accessToken: {type: "string"},
                                            refreshToken: {type: "string"},
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {description: "Unauthorized"},
                "404": {description: "Bad Request"},
            }
        }
    },
    "/auth/refresh": {
        post: {
            summary: "accessToken 재발급 API",
            description: REFRESH_DESC,
            tags: [TAG_NAME],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                refreshToken: {type: "string", description: "리프레시 토큰"},
                            },
                            required: ["refreshToken"],
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "성공",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {type: "boolean"},
                                    data: {
                                        type: "object",
                                        properties: {
                                            accessToken: {type: "string"},
                                            refreshToken: {type: "string"},
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {description: "Bad Request"},
            }
        }
    },
    "/auth/logout": {
        post: {
            summary: "로그아웃 (refreshToken 비활성화)",
            description: ``,
            tags: [TAG_NAME],
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {type: "boolean", default: true}
                                }
                            }
                        }
                    }
                },
                "401": {description: "Unauthorized"},
                "404": {description: "Bad Request"},
            }
        }
    }
}

export default authPaths;