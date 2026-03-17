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
    }
}

export default authPaths;