import {describe, expect, test} from "vitest";
import {getAllAccounts} from "@features/accounts/accounts.repository";
import {getUserById} from "@features/users/users.repository";
import {Account} from "@features/accounts/accounts.dto";


describe("accounts", () => {
    test("[repository] findAllMyAccount", async () => {
        const user = await getUserById("01KKWZ9G1SS4CJD1R03KDH5JGC");
        expect(user).not.toBeNull();
        const data: Account[] = await getAllAccounts(user!, undefined);
        expect(data.length).toBe(3);
        expect(typeof JSON.stringify(data)).toBe("string");
    })
})
