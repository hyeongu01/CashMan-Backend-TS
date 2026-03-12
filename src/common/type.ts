import {Request} from "express";
import {User} from "@features/users/users.dto";

export const AuthProvider = {
    NAVER: "NAVER",
    // GOOGLE: "GOOGLE",
    // KAKAO: "KAKAO",
}

export const CurrencyCode = {
    KRW: "KRW", // 한국 (원)
    // USD: "USD", // 미국 (달러)
    // JPY: "JPY" // 일본 (엔)
}

export const AccountType = {
    DEFAULT: 0,
    DEPOSIT: 1,
    INVESTMENT: 2
}

export interface AuthRequest extends Request {
    user: User;
}
