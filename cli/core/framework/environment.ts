import { file } from "../utils/index.js";

export interface NextEnvironment {
    [key: string]: string;
}

export function readEnvironment(): Record<string, NextEnvironment> {
    const envs = file.readCurrentDirectory().filter((f) => f.indexOf(".env.") === 0);

    const result: Record<string, NextEnvironment> = {};
    for (const env of envs) {
        const envName = env.split(".")[2] as string;

        // Skip local environments.
        if (envName === "local") {
            continue;
        }

        result[envName] = parseEnvironment(file.readFileToString(env));
    }

    return result;
}

export function readEnvironmentFile(env: string): NextEnvironment {
    return parseEnvironment(file.readFileToString(`.env.${env}`));
}

export function parseEnvironment(env: string): NextEnvironment {
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
