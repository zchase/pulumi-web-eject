import * as fs from "fs";

export function readFileToString(filePath: string): string {
    return fs.readFileSync(filePath).toString();
}

export function readCurrentDirectory(): string[] {
    return fs.readdirSync(".");
}
