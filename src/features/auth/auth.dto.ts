import * as z from "zod";

// 네이버 로그인 서비스 파라메터 스키마
export const NaverLoginParamsSchema = z.object({
    code: z.string(),
    state: z.string(),
});
// 네이버 로그인 서비스 파라메터 타입
export type NaverLoginParams = z.infer<typeof NaverLoginParamsSchema>;

// 로그인 결과 response
export type LoginResponse = {
    accessToken: string,
    refreshToken: string,
}

export const NaverProfileSchema = z.object({
    id: z.string(),
    name: z.string(),
    birthday: z.string().optional(),    // MM-dd 형식
    birthyear: z.string().optional(),   // yyyy 형식
});
export type NaverProfile = z.infer<typeof NaverProfileSchema>;

export const LoginParamsSchema = z.object({
    provider: z.string().uppercase(),
    providerId: z.string(),
    name: z.string(),
    birthDate: z.date().optional(),
});
export type LoginParams = z.infer<typeof LoginParamsSchema>;


export const CreateUserParamsSchema = z.object({
    name: z.string(),
    timezone: z.string().optional(),
    currency: z.string().length(3).optional(),
    birthDate: z.date().optional(),
    provider: z.string().uppercase(),
    providerId: z.string(),
})
export type CreateUserParams = z.infer<typeof CreateUserParamsSchema>;
