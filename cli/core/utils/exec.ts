import { exec } from "child_process";

export async function runCommand(...cmd: string[]) {
    return new Promise((res, rej) => {
        exec(cmd.join(" "), (error, stdout, stderr) => {
            if (error) {
                return rej(error);
            }

            if (stderr) {
                return res(stderr);
            }

            return res(stdout);
        })
    });
}
