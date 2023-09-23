import { file, exec } from "../utils/index.js";
import { program, stack } from "../pulumi/index.js";
import * as path from "path";

const ejectDestination = "infrastructure";

export async function ejectProgram(programName: string, environments: string[], description = "A simple pulumi program") {
    if (file.doesExist(ejectDestination)) {
        throw new Error("Directory `infrastructure` already exists.");
    }

    // Make infrastructure directory.
    file.makeDirectory(ejectDestination);

    // Init a node project and install dependencies.
    await exec.runCommand("yarn", "--cwd", ejectDestination, "init", "--yes");
    await exec.runCommand("yarn", "--cwd", ejectDestination, "add", "typescript", "ts-node", "@types/node", "--dev");
    await exec.runCommand("yarn", "--cwd", ejectDestination, "add", "@pulumi/pulumi", "@pulumi/aws");

    // Rewrite package.json main.
    const packageJSONPath = path.join(ejectDestination, "package.json");
    const packageJSON = JSON.parse(file.readFileToString(packageJSONPath));
    packageJSON.main = "index.ts";
    file.writeFileToString(packageJSONPath, JSON.stringify(packageJSON, null, 2));

    const programContents = program.createEjectableProgram();
    file.writeFileToString(`./infrastructure/index.ts`, programContents);
    file.writeFileToString("./infrastructure/Pulumi.yaml", program.createPulumiYamlString(programName, description));

    await stack.refreshConfigsEject(environments);
}
