import {OpenAPIV3} from "openapi-types";
import {CurrencyCode} from "@common/types/type.js";
import {CreateTransactionParamsSchema, UpdateTransactionParamsSchema} from "@features/transactions/transactions.dto";

const TAG_NAME = "05. Transactions";


const GET_TRANSACTIONS_DESC = `
  내 거래 목록 조회
  
  **request - query**
  - page?: 페이지네이션 페이지, default: 1
  - limit?: 페이지네이션 최대값, default: 5,
  - orderBy?
  - order: DESC | ASC
  - categoryId?: 필터링할 카테고리 ID, default: null (모든 값 조회)
  - fromAccountId?
  - toAccountId?
  - startDate?
  - endDate?
  
  **response**
  - success: 성공 여부
  - data: transaction 리스트 (category 테이블 join)
  - meta
    - count: 받은 수
    - page
    - limit
    - orderBy?
    - order: DESC | ASC
    - categoryId?
    - fromAccountId?
    - toAccountId?
  
  
`

const transactionsPaths: OpenAPIV3.PathsObject = {
    "/transactions": {
        post: {
            summary: "거래 생성",
            // deprecated: true,
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            requestBody: {
                content: {
                    'application/json': {
                        schema: CreateTransactionParamsSchema as OpenAPIV3.SchemaObject
                    }
                }
            },
            responses: {
                "200": {
                    description: "success",
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: "boolean"},
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: {type: 'string'},
                                            userId: {type: "string"},
                                            type: {type: "number", description: "0: 수입, 1: 지출, 2: 저축 추가, 3: 저축 취소, 4: 투자 추가, 5: 투자 취소"},
                                            categoryId: {type: "string", nullable: true},
                                            fromAccountId: {type: "string", nullable: true},
                                            toAccountId: {type: "string", nullable: true},
                                            amount: {type: "number"},
                                            currency: {type: "string", enum: Object.values(CurrencyCode)},
                                            transactionDate: {type: "string", format: "date"},
                                            createdAt: {type: "string", format: "date-time"},
                                            updatedAt: {type: "string", format: "date-time"},
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {description: "Bad Request"},
                "401": {description: "Unauthorized"},
                "404": {description: "Not Found"},
                "500": {description: "Server Error"},
            }
        },
        get: {
            summary: "거래 목록 조회",
            // deprecated: true,
            description: GET_TRANSACTIONS_DESC,
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                        default: "1"
                    }
                },
                {
                    name: "limit",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                        default: "5"
                    }
                },
                {
                    name: "orderBy",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                        default: "createdAt",
                    }
                },
                {
                    name: "order",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                        default: "ASC",
                    }
                },
                {
                    name: "categoryId",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                    }
                },
                {
                    name: "fromAccountId",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                    }
                },
                {
                    name: "toAccountId",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                    }
                },
                {
                    name: "startDate",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                    }
                },
                {
                    name: "endDate",
                    in: "query",
                    schema: {
                        type: "string",
                        nullable: true,
                    }
                },
            ],
            responses: {
                "200": {
                    description: "success",
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: "boolean"},
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: {type: 'string'},
                                                userId: {type: "string"},
                                                type: {type: "number", description: "0: 수입, 1: 지출, 2: 저축 추가, 3: 저축 취소, 4: 투자 추가, 5: 투자 취소"},
                                                categoryId: {type: "string", nullable: true},
                                                fromAccountId: {type: "string", nullable: true},
                                                toAccountId: {type: "string", nullable: true},
                                                amount: {type: "number"},
                                                currency: {type: "string", enum: Object.values(CurrencyCode)},
                                                transactionDate: {type: "string", format: "date"},
                                                createdAt: {type: "string", format: "date-time"},
                                                updatedAt: {type: "string", format: "date-time"},
                                                category: {
                                                    type: 'object',
                                                    nullable: true,
                                                    properties: {
                                                        id: {type: "string"},
                                                        userId: {type: "string"},
                                                        groupType: {type: "number"},
                                                        name: {type: "string"}
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    meta: {
                                        type: 'object',
                                        properties: {
                                            count: {type: "number"},
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
    },
    "/transactions/{transactionId}": {
        get: {
            summary: "거래 상세 조회",
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            parameters: [
                {
                    name: "transactionId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ],
            responses: {
                "200": {
                    description: "success",
                    content: {
                        'application/json': {
                            schema: {
                                type: "object",
                                properties: {
                                    id: {type: 'string'},
                                    userId: {type: "string"},
                                    type: {type: "number", description: "0: 수입, 1: 지출, 2: 저축 추가, 3: 저축 취소, 4: 투자 추가, 5: 투자 취소"},
                                    categoryId: {type: "string", nullable: true},
                                    fromAccountId: {type: "string", nullable: true},
                                    toAccountId: {type: "string", nullable: true},
                                    amount: {type: "number"},
                                    currency: {type: "string", enum: Object.values(CurrencyCode)},
                                    transactionDate: {type: "string", format: "date"},
                                    createdAt: {type: "string", format: "date-time"},
                                    updatedAt: {type: "string", format: "date-time"},
                                    category: {
                                        type: 'object',
                                        nullable: true,
                                        properties: {
                                            id: {type: "string"},
                                            userId: {type: "string"},
                                            groupType: {type: "number"},
                                            name: {type: "string"}
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {description: "Bad Request"},
                "401": {description: "Unauthorized"},
                "404": {description: "Not Found"},
                "500": {description: "Server Error"},
            }
        },
        patch: {
            summary: "거래 부분 수정",
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            parameters: [
                {
                    name: "transactionId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: UpdateTransactionParamsSchema as OpenAPIV3.SchemaObject
                    }
                }
            },
            responses: {
                "200": {
                    description: "success",
                    content: {
                        'application/json': {
                            schema: {
                                type: "object",
                                properties: {
                                    id: {type: 'string'},
                                    userId: {type: "string"},
                                    type: {type: "number", description: "0: 수입, 1: 지출, 2: 저축 추가, 3: 저축 취소, 4: 투자 추가, 5: 투자 취소"},
                                    categoryId: {type: "string", nullable: true},
                                    fromAccountId: {type: "string", nullable: true},
                                    toAccountId: {type: "string", nullable: true},
                                    amount: {type: "number"},
                                    currency: {type: "string", enum: Object.values(CurrencyCode)},
                                    transactionDate: {type: "string", format: "date"},
                                    createdAt: {type: "string", format: "date-time"},
                                    updatedAt: {type: "string", format: "date-time"},
                                }
                            }
                        }
                    }
                },
                "400": {description: "Bad Request"},
                "401": {description: "Unauthorized"},
                "404": {description: "Not Found"},
                "500": {description: "Server Error"},
            }
        },
        delete: {
            summary: "거래 삭제",
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            parameters: [
                {
                    name: "transactionId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ],
            responses: {
                "200": {description: "success"},
                "400": {description: "Bad Request"},
                "401": {description: "Unauthorized"},
                "404": {description: "Not Found"},
                "500": {description: "Server Error"},
            }
        }
    }
};

export default transactionsPaths;