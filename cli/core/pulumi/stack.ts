import * as pulumi from "@pulumi/pulumi";
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
