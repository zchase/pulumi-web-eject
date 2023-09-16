import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import figures from "figures";
import Spinner from "ink-spinner";
import MultiSelect from "./multiSelect.js";
import { useAppSelector, useAppDispatch } from "../store/index.js";
import { configureEnvironment, getEnvironment, getConfiguredEnvironments } from "../store/enviroment.js";
import { stack } from "../core/pulumi/index.js";

interface ConfigureEnvironmentProps {
    projectName: string;
    env: string;
    active: boolean;
    additionalConfig: Record<string, string>;
    handleDone: (env: string) => void;
}

const ConfigureEnvironment: React.FC<ConfigureEnvironmentProps> = ({ projectName, env, active, handleDone }) => {
    const dispatch = useAppDispatch();
    const environment = useAppSelector(getEnvironment(env));
    const configuredEnvironments = useAppSelector(getConfiguredEnvironments);

    const [inProgress, setInProgress] = useState(false);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (configuredEnvironments.indexOf(env) > -1) {
            setIsDone(true);
            handleDone(env);
        }
    }, [configuredEnvironments]);

    const handleSecrets = (secrets: { label: string; value: string; }[]) => {
        if (!active) {
            return;
        }

        const config: stack.ConfigMap = {};
        for (const key in environment) {
            const secret = secrets.map(s => s.value).indexOf(key) > -1;
            config[key] = {
                secret,
                value: environment[key]!,
            }
        }

        setInProgress(true);

        dispatch(configureEnvironment({
            projectName,
            env,
            config,
        }));
    };

    const envItems = Object.keys(environment!).map(e => ({ value: e, label: e }));

    return(
        <Box flexDirection="column">
            <Box>
                <Box marginRight={1} display={ active ? "flex" : undefined }>
                    <Text color="blueBright">
                        <Spinner type="dots" />
                    </Text>
                </Box>

                <Box marginRight={1} display={ isDone && !active ? "flex" : undefined}>
                    <Text color="green">
                        { figures.tick }
                    </Text>
                </Box>

                <Box marginRight={1} display={ !isDone && !active ? "flex" : undefined}>
                    <Text color="yellow">
                        { figures.checkboxCircleOff }
                    </Text>
                </Box>

                <Box display={ active ? "flex" : undefined }>
                    <Text>Configuring your { env } environment...</Text>
                </Box>

                <Box display={ !active ? "flex" : undefined }>
                    <Text>{ env }</Text>
                </Box>
            </Box>

            <Box display={ active ? "flex" : undefined } marginBottom={1} marginLeft={3} marginTop={1}>
                <Box display={ !inProgress ? "flex" : undefined }>
                    <MultiSelect
                        key={env}
                        text="Please select mark which config values are secret:"
                        options={envItems}
                        handleSubmit={handleSecrets}
                    />
                </Box>

                <Box display={ inProgress ? "flex" : undefined }>
                    <Text>Creating the stack with config values</Text>
                </Box>
            </Box>
        </Box>
    );
};

export default ConfigureEnvironment;
