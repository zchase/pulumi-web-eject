import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import figures from "figures";
import Spinner from "ink-spinner";
import { useAppSelector, useAppDispatch } from "../store/index.js";
import { configureEnvironment, getEnvironment, getConfiguredEnvironments } from "../store/enviroment.js";

interface ConfigureEnvironmentProps {
    projectName: string;
    env: string;
    active: boolean;
    additionalConfig: Record<string, { value: string; secret: boolean; }>;
    handleDone: (env: string) => void;
}

const ConfigureEnvironment: React.FC<ConfigureEnvironmentProps> = ({ projectName, env, active, handleDone, additionalConfig }) => {
    const dispatch = useAppDispatch();
    const environment = useAppSelector(getEnvironment(env));
    const configuredEnvironments = useAppSelector(getConfiguredEnvironments);

    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        if (active) {
            const config: Record<string, any> = {};
            for (const key in environment) {
                config[key] = { value: environment[key] };
            }

            dispatch(configureEnvironment({
                projectName,
                env,
                config: Object.assign({}, config, additionalConfig),
            }));
        }
    }, [active]);

    useEffect(() => {
        if (configuredEnvironments.indexOf(env) > -1) {
            setIsDone(true);
            handleDone(env);
        }
    }, [configuredEnvironments]);

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
                <Box>
                    <Text>Creating the stack with config values</Text>
                </Box>
            </Box>
        </Box>
    );
};

export default ConfigureEnvironment;
