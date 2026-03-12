import * as z from "zod";

type CustomResponse = {
    success: true,
    data?: any,
    meta?: any,
};

type MakeResponseParams = {
    data?: any,
    meta?: any,
}

/**
 * 표준 성공 응답 코드
 * @param params
 */
export const makeResponse = (params: MakeResponseParams): CustomResponse => {
    return {
        success: true,
        data: params.data,
        meta: params.meta,
    };
}

export const CustomErrorSchema = z.object({
    statusCode: z.number().min(200).max(500),
    success: z.boolean(),
    error: z.object({
        code: z.string(),
        message: z.string(),
    }),
})
export type CustomError = z.infer<typeof CustomErrorSchema>;

/**
 * 표준 에러 생성 코드
 * @param statusCode
 * @param code
 */
const makeError = (statusCode: number, code: string) => {
    return (message: string = code): CustomError => ({
        statusCode,
        success: false,
        error: {
            code,
            message,
        }
    });
}

/**
 * 표준 에러 객체 반환
 */
export const customError = {
    UNAUTHORIZED: makeError(401, "UNAUTHORIZED"),
    BAD_REQUEST: makeError(400, "BAD_REQUEST"),
    NOT_FOUND: makeError(404, "NOT_FOUND"),
    SERVER_ERROR: makeError(500, "SERVER_ERROR"),

} as const;
