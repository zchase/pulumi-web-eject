import * as fs from "fs";

export function doesExist(filePath: string): boolean {
    try {
        return fs.existsSync(filePath);
    } catch (e) {
        return false;
    }
}

export function makeDirectory(dirPath: string) {
    return fs.mkdirSync(dirPath);
}

export function writeFileToString(filePath: string, contents: string) {
    return fs.writeFileSync(filePath, contents);
}

export function readFileToString(filePath: string): string {
    return fs.readFileSync(filePath).toString();
}

export function readCurrentDirectory(): string[] {
    return fs.readdirSync(".");
}

export function readDirectory(dir: string): string[] {
    return fs.readdirSync(dir);
}
