import config from "@config/config";
import {generateSeed} from "./seeds/development";



async function main() {
    if (config.app === "production") {
        // TODO: production 용 데이터 (필요하다면)
    } else {
        await generateSeed();
    }
}

main();
