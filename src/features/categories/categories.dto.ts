import {category} from "@generated/prisma/client";
import {ajv, type JSONSchemaType, type ValidateFunction} from "@libs/ajv";


export type Category = category;

export type CreateCategoryRequestBody = Pick<Category, "name" | "groupType">;
export const CreateCategoryRequestBodySchema: JSONSchemaType<CreateCategoryRequestBody> = {
    type: "object",
    properties: {
        name: {type: "string", maxLength: 50},
        groupType: {
            type: 'number',
            maximum: 2,
            minimum: 0
        }
    },
    required: ['name', 'groupType']
}
export const validateCreateCategoryRequestBody: ValidateFunction =
    ajv.compile(CreateCategoryRequestBodySchema);

