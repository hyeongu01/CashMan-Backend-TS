import {OpenAPIV3} from "openapi-types";
import {CreateCategoryRequestBody, CreateCategoryRequestBodySchema} from "@features/categories/categories.dto";
import {JSONSchemaType} from "ajv";
import {AccountType} from "@common/type";


const TAG_NAME = "04. Categories";

const POST_CATEGORY_DESC = `
  카테고리 생성
  
  **request - body**  
  - name: 카테고리 이름
  - groupType: ${JSON.stringify(AccountType)}
  
`

const GET_CATEGORY_DESC = `
  카테고리 조회
  
  **request - query**
  - groupType?: ${Object.values(AccountType).join(" | ")}  
     0: 기본 계좌, 1: 저축 계좌, 2: 투자 계좌  
    (default: 모든 그룹 조회)
    
    
  **response**
  - data: Category 배열
  - meta
    - count: data 길이
    - groupType?: 필터된 groupType (없으면 전달되지 않는다)
    
  **정렬 방식**
  1. groupType: "asc",
  2. name: "asc
`

const PATCH_CATEGORY_DESC = `
  카테고리 수정
  
  **request - body**
  - name
  - groupType
  
  **request - path**
  - categoryId
  
  **response**
  - data: 업데이트된 Category.

`


const authPaths: OpenAPIV3.PathsObject = {
    "/categories": {
        post: {
            summary: "카테고리 생성",
            description: POST_CATEGORY_DESC,
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            requestBody: {
                content: {
                    'application/json': {
                        schema: CreateCategoryRequestBodySchema as OpenAPIV3.SchemaObject
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
                                    success: {type: "boolean"},
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: {type: "string"},
                                            userId: {type: "string"},
                                            groupType: {type: "integer"},
                                            name: {type: "string"},
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
            summary: "내 카테고리 조회",
            // deprecated: true,
            description: GET_CATEGORY_DESC,
            tags: [TAG_NAME],
            parameters: [
                {
                    in: "query",
                    name: "groupType",
                    required: false,
                    schema: {
                        type: 'integer',
                        enum: Object.values(AccountType),
                    }
                }
            ],
            security: [{BearerAuth: []}],
            responses: {
                "200": {
                    description: "success",
                    content: {
                        'application/json': {
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
                                                userId: {type: "string"},
                                                groupType: {type: "integer"},
                                                name: {type: "string"},
                                            }
                                        }
                                    },
                                    meta: {
                                        type: 'object',
                                        properties: {
                                            count: {type: "integer"},
                                            groupType: {type: "integer"},
                                        },
                                        required: ["count"]
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
    },
    "/categories/{categoryId}": {
        patch: {
            // deprecated: true,
            summary: "내 카테고리 수정",
            description: PATCH_CATEGORY_DESC,
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            parameters: [
                {
                    name: "categoryId",
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
                            properties: {
                                name: {type: "string", nullable: true},
                                groupType: {type: "integer", nullable: true},
                            },
                        }
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
                                    success: {type: "boolean"},
                                    data: {
                                        type: "object",
                                        properties: {
                                            id: {type: "string"},
                                            userId: {type: "string"},
                                            groupType: {type: "integer"},
                                            name: {type: "string"},
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {description: "Bad Request"},
                "401": {description: "Unauthorized"},
                "403": {description: "Forbidden"},
                "404": {description: "Not Found"},
                "409": {description: "overlapping category"},
                "500": {description: "Server Error"},
            }
        },
        delete: {
            summary: "내 카테고리 삭제",
            // deprecated: true,
            description: ``,
            tags: [TAG_NAME],
            security: [{BearerAuth: []}],
            parameters: [
                {
                    name: "categoryId",
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
    }
}

export default authPaths;