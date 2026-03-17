import {user} from "@generated/prisma/client";

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



declare global {
    namespace Express {
        interface User extends user {}
    }

    interface BigInt {
        toJSON(): number;
    }
}
BigInt.prototype.toJSON = function (): number {
    return Number(this);
}

