import {ajv, type JSONSchemaType, type ValidateFunction} from "@libs/ajv";
import {transaction} from "@generated/prisma/client";
import {CurrencyCode} from "@common/types/type";

export type Transaction = transaction;


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




