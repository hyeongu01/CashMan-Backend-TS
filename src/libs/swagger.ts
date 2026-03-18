import {OpenAPIV3} from "openapi-types";
import {readdirSync} from "fs";
import {join, resolve} from "path";
import {fileURLToPath, pathToFileURL} from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const featuresDir = resolve(__dirname, "../features");

const allPaths: OpenAPIV3.PathsObject = {};
for (const entry of readdirSync(featuresDir, {withFileTypes: true, recursive: true})) {
    if (entry.name.endsWith(".swagger.js") || entry.name.endsWith(".swagger.ts")) {
        const filePath = join(entry.parentPath, entry.name);
        const mod = await import(pathToFileURL(filePath).href);
        Object.assign(allPaths, mod.default);
    }
}

export const swaggerSpec: OpenAPIV3.Document = {
    openapi: "3.0.0",
    servers: [
        {url: "http://localhost:3000", description: "Local"},
        {url: "http://49.171.159.199:3000", description: "RaspberryPi"},
    ],
    tags: [
        {name: "01. Auth"},
        {name: "02. Users"},
        {name: "03. Accounts"},
        {name: "04. Categories"},
        {name: "05. Transactions"},
        {name: "99. Test"},
    ],
    info: {
        title: "CashMan API",
        version: "1.0.0",
        description: "CashMan 가계부 서비스 API",
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "JWT Access Token",
            }
        }
    },
    paths: allPaths,
}

export default swaggerSpec;
