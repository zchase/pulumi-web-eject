import * as pulumi from "@pulumi/pulumi";
import { exec, file } from "../utils/index.js";

const { automation } = pulumi;

export type ConfigMap = pulumi.automation.ConfigMap;

// initStack creates a new stack.
export async function initStack(projectName: string, stackName: string): Promise<pulumi.automation.Stack> {
    return await automation.LocalWorkspace.createOrSelectStack({
        projectName,
        stackName,
        program: async () => {},
    });
}

// setInitialStackConfig will set the intial config for a new stack.
// It runs an update with an empty program so running with an existing
// stack will lead to a bad time.
export async function setInitialStackConfig(stack: pulumi.automation.Stack, config: pulumi.automation.ConfigMap): Promise<void> {
    await stack.setAllConfig(config);
    await stack.up({ message: "Setting initial configuration values" });
}

// refreshConfigForEject will grab the currenlty set config in Pulumi Cloud
// and update the corresponding Pulumi.*.yaml file.
export async function refreshConfigForEject(stackName: string): Promise<void> {
    await exec.runCommand("pulumi", "--cwd", "./infrastructure", "stack", "select", stackName);
    await exec.runCommand("pulumi", "--cwd", "./infrastructure", "config", "refresh", "-f")
}

// refreshConfigsEject takes a list of stack names and writes out an updated
// config from Pulumi Cloud.
export async function refreshConfigsEject(stacks: string[]): Promise<void> {
    const current = stacks.shift();
    if (!current) {
        return;
    }

    file.writeFileToString(`./infrastructure/Pulumi.${current}.yaml`, "");
    await refreshConfigForEject(current);

    return await refreshConfigsEject(stacks);
}
