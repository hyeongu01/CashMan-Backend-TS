import {OpenAPIV3} from "openapi-types";
import {CurrencyCode} from "@common/types/type.js";

const TAG_NAME = "05. Transactions";

const transactionsPaths: OpenAPIV3.PathsObject = {
    "/transactions": {
        post: {
            summary: "거래 생성",
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