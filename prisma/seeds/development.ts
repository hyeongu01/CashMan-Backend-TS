import prismaClient from "@config/db.config";
import {type user, type category} from "@generated/prisma/client";
import {ulid} from "ulid";

const categoryNames = ["식비", "교통", "쇼핑", "의료", "문화", "교육", "통신", "주거", "여행", "기타"];

function pickRandom<T>(arr: T[], min: number, max: number): T[] {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// TODO: test - user 12명 생성
const testUsers = [
    { name: `TEST-${Date.now()}-1`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-2`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-3`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-4`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-5`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-6`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-7`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-8`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-9`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-10`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-11`, birthDate: new Date("2001-08-02") },
    { name: `TEST-${Date.now()}-12`, birthDate: new Date("2001-08-02") },
];

const userIds: string[] = [];


export const generateSeed = async (): Promise<void> => {
    await prismaClient.$transaction(async tx => {
        for (const u of testUsers) {
            const user: user = await tx.user.create({data: {id: ulid(), ...u}});
            await tx.user_auth.create({
                data: {
                    userId: user.id,
                    provider: "NAVER",
                    providerId: user.name,
                }
            });
            await tx.account.createMany({
                data: [
                    {
                        userId: user.id,
                        id: ulid(),
                        groupType: 0,
                        currency: user.currency,
                    },
                    {
                        userId: user.id,
                        id: ulid(),
                        groupType: 1,
                        currency: user.currency,
                    },
                    {
                        userId: user.id,
                        id: ulid(),
                        groupType: 2,
                        currency: user.currency,
                    },
                ]
            })
            const categoryData = pickRandom(categoryNames, 2, 5);
            const categories: category[] = [];
            for (let i = 0; i < categoryData.length; i++) {
                const cat = await tx.category.create({
                    data: {
                        id: ulid(),
                        userId: user.id,
                        name: categoryData[i],
                        groupType: i % 3,
                    },
                });
                categories.push(cat);
            }

            await tx.transaction.createMany({
                data: Array.from({ length: 20 }, () => {
                    const randomCat = categories[Math.floor(Math.random() * categories.length)];
                    const day = Math.floor(Math.random() * 28) + 1;
                    const month = Math.floor(Math.random() * 3) + 1;
                    return {
                        id: ulid(),
                        userId: user.id,
                        type: Math.floor(Math.random() * 2),
                        categoryId: randomCat.id,
                        amount: BigInt((Math.floor(Math.random() * 100) + 1) * 1000),
                        currency: user.currency,
                        transactionDate: new Date(`2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`),
                    };
                }),
            });
            userIds.push(user.id);
        }
    })
    console.log(JSON.stringify(userIds));

    prismaClient.$disconnect();
}
