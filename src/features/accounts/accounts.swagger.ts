import {OpenAPIV3} from "openapi-types";
import {CurrencyCode} from "@common/type";

const TAG_NAME = "03. Accounts";

const getAccountsDescription: string = `
  내 모든 계좌 조회
  
  **[request parameters] - query**
  - currency?: 3자리 통화 코드 (기본값: user.currency) (${Object.values(CurrencyCode)})
  
  **계좌 항목 설명**
  - id: ulid
  - groupType: 0: 기본 계좌, 1: 저축 계좌, 2: 투자 계좌
  - userId: 유저 ID (ulid)
  - currency: ${Object.values(CurrencyCode).join(", ")}
  - balance: 잔액 (currency 에 따라 소수점을 다르게 적용)
  - createdAt:
  - updatedAt: 
`

const usersPaths: OpenAPIV3.PathsObject = {
    "/accounts": {
        get: {
            summary: "내 모든 계좌 조회",
            description: getAccountsDescription,
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            parameters: [
                {
                    name: "currency",
                    in: "query",
                    required: false,
                    schema: {
                        type: 'string',
                        enum: Object.values(CurrencyCode),
                        example: "KRW",
                    }
                }
            ],
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {type: "boolean"},
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: {type: "string"},
                                                groupType: {type: "integer"},
                                                userId: {type: "string"},
                                                currency: {
                                                    type: "string",
                                                    enum: Object.values(CurrencyCode),
                                                },
                                                balance: {type: "string"},
                                                createdAt: {
                                                    type: "string",
                                                    format: "datetime"
                                                },
                                                updatedAt: {
                                                    type: "string",
                                                    format: "datetime"
                                                },

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "401": {description: "Unauthorized"},
                "500": {description: "Server Error"},
            }
        }
    }
};

export default usersPaths;