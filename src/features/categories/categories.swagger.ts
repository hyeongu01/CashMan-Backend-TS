import {OpenAPIV3} from "openapi-types";
import {CreateCategoryRequestBody, CreateCategoryRequestBodySchema} from "@features/categories/categories.dto";
import {JSONSchemaType} from "ajv";


const TAG_NAME = "04. Categories";



const authPaths: OpenAPIV3.PathsObject = {
    "/categories": {
        post: {
            summary: "카테고리 생성",
            description: `카테고리 생성`,
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
                                    id: {type: "string"},
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