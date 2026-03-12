import {OpenAPIV3} from "openapi-types";

const testPaths: OpenAPIV3.PathsObject = {
    "/test/naver/login": {
        get: {
            summary: "네이버 로그인 테스트 링크",
            tags: ["99. Test"],
            parameters: [

            ],
            responses: {
                "200": {
                    description: "성공"
                }
            }
        }
    },
}

export default testPaths;