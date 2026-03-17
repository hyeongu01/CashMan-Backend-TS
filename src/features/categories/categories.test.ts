import {describe, expect, test} from "vitest";
import {validateCreateCategoryRequestBody} from "@features/categories/categories.dto";

describe("categories", () => {
    test("[dto] validateCreateCategoryRequestBody", async () => {
        const params1 = {
            name: "asdfasdfasdfasdfasdfsadfsdfsadf",
            groupType: 1,
        }
        const params2 = {
            name: "asdfasdfasdfasdfasdfsadfsdfsadfasdfasdfasdfasdfasdfsadfsdfsadf",
            groupType: 1,
        }
        const params3 = {
            name: "normal",
            groupType: 3,
        }
        const params4 = {
            name: "normal",
            groupType: 0,
        }
        const params5 = {
            name: "normal",
            groupType: -1,
        }
        expect(validateCreateCategoryRequestBody(params1)).toBe(true);
        expect(validateCreateCategoryRequestBody(params2)).toBe(false);
        expect(validateCreateCategoryRequestBody(params3)).toBe(false);
        expect(validateCreateCategoryRequestBody(params4)).toBe(true);
        expect(validateCreateCategoryRequestBody(params5)).toBe(false);
    })
})