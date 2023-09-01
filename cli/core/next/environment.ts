import { file } from "../utils/index.js";

export function isNextJSProject(): boolean {
    try {
        file.readFileToString("./next.config.js");
        return true;
    } catch (e) {
        return false;
    }
}

export interface NextEnvironment {
    [key: string]: string;
}

export function readNextEnvironment(): Record<string, NextEnvironment> {
    const envs = file.readCurrentDirectory().filter((f) => f.indexOf(".env.") === 0);

    const result: Record<string, NextEnvironment> = {};
    for (const env of envs) {
        const envName = env.split(".")[2] as string;

        // Skip local environments.
        if (envName === "local") {
            continue;
        }

        result[envName] = parseNextEnvironment(file.readFileToString(env));
    }

    return result;
}

export function readNextEnvironmentFile(env: string): NextEnvironment {
    return parseNextEnvironment(file.readFileToString(`.env.${env}`));
}

export function parseNextEnvironment(env: string): NextEnvironment {
    return env.split("\n").reduce((config, item) => {
        const parts = item.split("=");
        const key = parts[0]
        if (key !== undefined && key !== "") {
            // @ts-ignore
            config[key] = parts[1];
        }

        return config;
    }, {} as Record<string, string>);
}
