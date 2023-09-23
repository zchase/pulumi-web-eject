import * as pulumi from "@pulumi/pulumi";
import { websiteProgram, installPlugins } from "./program.js";

export type PulumiLogHanlder = (log: string) => void;

const { automation } = pulumi;

export async function selectStack(projectName: string, stackName: string) {
    return await automation.LocalWorkspace.selectStack({
        projectName: projectName,
        stackName: stackName,
        program: async () => websiteProgram(),
    });
}

export async function installPulumiPlugins(stack: pulumi.automation.Stack) {
    await installPlugins(stack);
}

export async function refreshConfig(stack: pulumi.automation.Stack) {
    await stack.workspace.refreshConfig(stack.name);
}

export async function refreshStack(stack: pulumi.automation.Stack, logger: PulumiLogHanlder) {
    await stack.refresh({ onOutput: logger });
}

export async function updateStack(stack: pulumi.automation.Stack, logger: PulumiLogHanlder) {
    await stack.up({ onOutput: logger });
}

export async function previewStack(stack: pulumi.automation.Stack, _logger: PulumiLogHanlder) {
    await stack.preview({});
}

export async function destroyStack(stack: pulumi.automation.Stack, logger: PulumiLogHanlder) {
    await stack.destroy({ onOutput: logger });
}
