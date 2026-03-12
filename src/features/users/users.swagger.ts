import {OpenAPIV3} from "openapi-types";
import {CurrencyCode} from "@common/type";

const TAG_NAME = "02. Users";

const usersPaths: OpenAPIV3.PathsObject = {
    "/users/me": {
        get: {
            summary: "내 정보 조회 (개발중)",
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {type: "boolean", default: true},
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: {type: "string"},
                                            name: {type: "string"},
                                            timezone: {type: "string"},
                                            currency: {
                                                type: "string",
                                                enum: Object.values(CurrencyCode),
                                                example: "KRW",
                                            },
                                            birthDate: {
                                                type: "string",
                                                format: "date",
                                                description: "yyyy-MM-dd 형식 문자열"
                                            },
                                            createdAt: {
                                                type: "string",
                                                format: "date-time",
                                                description: "iso 8601 형식 (예: 2026-03-12T12:00:00.000Z)"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        patch: {
            summary: "내 정보 부분 수정 (개발중)",
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: "object",
                            properties: {
                                name: {type: "string"},
                                timezone: {type: "string"},
                                currency: {type: "string"},
                                birthDate: {type: "string", description: 'yyyy-MM-dd 형식 문자열'}, // yyyy-MM-dd 형식 문자열
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {type: "boolean", default: true},
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: {type: "string"},
                                            name: {type: "string"},
                                            timezone: {type: "string"},
                                            currency: {
                                                type: "string",
                                                enum: Object.values(CurrencyCode),
                                                example: "KRW",
                                            },
                                            birthDate: {
                                                type: "string",
                                                format: "date",
                                                description: "yyyy-MM-dd 형식 문자열"
                                            },
                                            createdAt: {
                                                type: "string",
                                                format: "date-time",
                                                description: "iso 8601 형식 (예: 2026-03-12T12:00:00.000Z)"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        delete: {
            summary: "내 정보 소프트 딜리트 (개발중)",
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            responses: {
                "200": {
                    description: "Success",
                    content: {
                        'application/json': {
                            schema: {
                                type: "object",
                                properties: {
                                    success: {type: "boolean", default: true},
                                }
                            }
                        }
                    }
                },
                "500": {description: "Server Error"},
            }
        }
    },
};

export default usersPaths;