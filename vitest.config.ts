import {defineConfig, defineProject} from "vitest/config";
import path from "path";
import config from "@config/config";

const sharedResolve = {
    alias: {
        "@config": path.resolve(__dirname, "config"),
        "@features": path.resolve(__dirname, "src/features"),
        "@generated": path.resolve(__dirname, "prisma/generated"),
        "@libs": path.resolve(__dirname, "src/libs"),
        "@common": path.resolve(__dirname, "src/common"),
    },
};

export default defineConfig({
    resolve: sharedResolve,
    test: {
        setupFiles: ["./src/common/types/global.ts"],
        env: {
        }
    }
});