import {OpenAPIV3} from "openapi-types";
import {CurrencyCode} from "@common/types/type.js";
import {CreateTransactionParamsSchema} from "@features/transactions/transactions.dto";

const TAG_NAME = "05. Transactions";

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
                "500": {description: "Server Error"},
            }
        },
        get: {
            summary: "거래 목록 조회",
            deprecated: true,
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            responses: {
                "200": {description: "success"},
                "400": {description: "Bad Request"},
                "401": {description: "Unauthorized"},
                "403": {description: "Forbidden"},
                "500": {description: "Server Error"},
            }
        }
    },
    "/transactions/{transactionId}": {
        get: {
            summary: "거래 상세 조회",
            deprecated: true,
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
                "403": {description: "Forbidden"},
                "500": {description: "Server Error"},
            }
        },
        patch: {
            summary: "거래 부분 수정",
            deprecated: true,
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
                        schema: {
                            type: "object",
                        }
                    }
                }
            },
            responses: {
                "200": {description: "success"},
                "400": {description: "Bad Request"},
                "401": {description: "Unauthorized"},
                "403": {description: "Forbidden"},
                "500": {description: "Server Error"},
            }
        },
        delete: {
            summary: "거래 삭제",
            deprecated: true,
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
                "403": {description: "Forbidden"},
                "500": {description: "Server Error"},
            }
        }
    }
};

export default transactionsPaths;