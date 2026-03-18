import {user} from "@generated/prisma/client.js";

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
