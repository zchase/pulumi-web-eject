import { file } from "../utils/index.js";

export function isValidProject(): boolean {
    try {
        file.readFileToString("./next.config.js");
        return true;
    } catch (e) {
        return false;
    }
}
