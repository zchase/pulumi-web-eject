import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import StatusSpinner from './components/statusSpinner.js';
import PulumiActionTable from './components/pulumiActionTable.js';

import * as pulumiRunner from "./core/pulumi/run.js";
import { useAppSelector, useAppDispatch } from "./store/index.js";
import { getPulumiError, getProjectName, setStackName, getMessages, addMessage } from "./store/pulumi.js";

interface DeployProps {
    cliArgs: {
        environment: string;
    };
}

const Deploy: React.FC<DeployProps> = ({ cliArgs }) => {
    if (!cliArgs.environment) {
        return(
            <Box>
                <Text>
                    Missing flag -environment is required.
                </Text>
            </Box>
        );
    }

    const dispatch = useAppDispatch();
    const projectName = useAppSelector(getProjectName);
    const error = useAppSelector(getPulumiError);
    const messages = useAppSelector(getMessages);
    const tableData: any[] = Object.values(messages);

    const [step, setStep] = useState(1);

    useEffect(() => {
        dispatch(setStackName(cliArgs.environment));

        const deployStack = async () => {
            // Get the Stack.
            const stack = await pulumiRunner.selectStack(projectName, cliArgs.environment);

            // Install the plugins.
            setStep(2)
            await pulumiRunner.installPulumiPlugins(stack);

            // Refresh the config.
            setStep(3)
            await pulumiRunner.refreshConfig(stack);

            // Run the update.
            setStep(4);
            await pulumiRunner.updateStack(stack, (msg: string) => {
                const parts = msg.trim().split(" ");

                // Only use resource messages that start with +
                if (parts[0] !== "+") {
                    return;
                }

                const resource = parts[2]!;
                const resourceName = parts[3]!;
                const status = parts[4]!;
                const key = `${resource}-${resourceName}`;

                // Ignore pulumi stack resources
                if (resource === "pulumi:pulumi:Stack") {
                    return;
                }

                dispatch(addMessage({
                    key,
                    message: { resource, name: resourceName, status },
                }));
            });

            setStep(5);
            process.exit(0);
        };

        deployStack();
    }, []);

    if (error) {
        return(
            <Box>
                <Text>
                    { error }
                </Text>
            </Box>
        );
    }


    return(
        <Box flexDirection="column">
            <Box flexDirection="column" marginBottom={1}>
                <StatusSpinner inProgress={step === 1} done={step > 1} text="Select Stack" />
                <StatusSpinner inProgress={step === 2} done={step > 2} text="Install Plugins" />
                <StatusSpinner inProgress={step === 3} done={step > 3} text="Refresh Config" />
                <StatusSpinner inProgress={step === 4} done={step > 4} text="Deploy Website" />
            </Box>

            <Box display={ step > 3 ? "flex" : undefined }>
                <PulumiActionTable done={step === 5} data={tableData} columns={["name", "resource", "status"]} />
            </Box>
        </Box>
    );
};

export default Deploy;
