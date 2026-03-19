import {ajv, type JSONSchemaType, type ValidateFunction} from "@libs/ajv";
import {transaction} from "@generated/prisma/client";
import {CurrencyCode, PaginationParams} from "@common/types/type";
import {Prisma} from "@generated/prisma/client";

type TransactionRelations = {
    category: true,
    from_account: true,
    to_account: true,
}

export type Transaction<T extends (keyof TransactionRelations)[] | undefined = undefined> =
    (T extends (keyof TransactionRelations)[]
        ? Prisma.transactionGetPayload<{include: Pick<TransactionRelations, T[number]>; }>
        : transaction);





export type CreateTransactionParams = {
    type: number;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    amount: number;
    currency: string;
    transactionDate: string;
};
export const CreateTransactionParamsSchema: JSONSchemaType<CreateTransactionParams> = {
    type: "object",
    properties: {
        type: {type: "number"},
        categoryId: {type: "string", nullable: true},
        fromAccountId: {type: "string", nullable: true},
        toAccountId: {type: "string", nullable: true},
        amount: {type: "number"},
        currency: {type: "string", enum: Object.values(CurrencyCode)},
        transactionDate: {type: "string", format: "date"},
    },
    required: ["type", "amount", "currency", "transactionDate"]
}
export const validateTransactionParams: ValidateFunction<CreateTransactionParams> = ajv.compile(CreateTransactionParamsSchema);

export type TransactionPaginationParams = PaginationParams & {
    categoryId?: string,
    fromAccountId?: string,
    toAccountId?: string,
    startDate?: string,
    endDate?: string,
}
export const TransactionPaginationParamsSchema: JSONSchemaType<TransactionPaginationParams> = {
    type: "object",
    properties: {
        page: {type: "string", format: "int32"},
        limit: {type: "string", format: "int32"},
        orderBy: {type: "string"},
        order: {
            type: "string",
            enum: ["asc", "desc"],
        },
        categoryId: {type: "string", nullable: true},
        fromAccountId: {type: "string", nullable: true},
        toAccountId: {type: "string", nullable: true},
        startDate: {type: "string", nullable: true},
        endDate: {type: "string", nullable: true},
    },
    required: ['page', 'limit', 'orderBy', 'order'],
}
export const validateTransactionPaginationParams: ValidateFunction<TransactionPaginationParams> = ajv.compile(TransactionPaginationParamsSchema);


export type UpdateTransactionParams = {
    type?: number;
    categoryId?: string;
    fromAccountId?: string;
    toAccountId?: string;
    amount?: number;
    transactionDate?: string;
}
export const UpdateTransactionParamsSchema: JSONSchemaType<UpdateTransactionParams> = {
    type: "object",
    properties: {
        type: {type: "number", nullable: true},
        categoryId: {type: "string", nullable: true},
        fromAccountId: {type: "string", nullable: true},
        toAccountId: {type: "string", nullable: true},
        amount: {type: "number", nullable: true},
        transactionDate: {type: "string", format: "date", nullable: true},
    }
}
export const validateUpdateTransactionParams: ValidateFunction<UpdateTransactionParams> = ajv.compile(UpdateTransactionParamsSchema);


