import {describe, expect, test} from "vitest";

function sum(a: number, b: number): number {
    return a + b;
}

describe("accounts", () => {
    test('[service] add test', () => {
        expect(sum(1, 2)).toBe(3);
    })
    test("[controller] dd", () => {
        expect(sum(1, 2)).toBe(3);
    })
})
