import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import { useAppSelector } from "./store/index.js";
import { getEnvironments, getConfiguredEnvironments, getProjectName } from "./store/enviroment.js";
import ConfigureEnvironment from "./components/configureEnv.js";
import MultiSelect from "./components/multiSelect.js";
import WizardStep from "./components/wizardStep.js";

interface InitProps {

}

const Init: React.FC<InitProps> = ({}) => {
    const [step, setStep] = useState(1);
    const [environmentsToConfigure, setEnvironmentsToConfigure] = useState<string[]>([]);
    const [activeEnvironment, setActiveEnvironment] = useState("");
    const environments = useAppSelector(getEnvironments);
    const configuredEnvironments = useAppSelector(getConfiguredEnvironments);
    const projectName = useAppSelector(getProjectName);

    useEffect(() => {
        if (step === 2 && environmentsToConfigure.length === configuredEnvironments.length) {
            setStep(3);
            setTimeout(() => process.exit(0), 500);
        }
    }, [ environments, configuredEnvironments ]);

    if (!Object.keys(environments).length) {
        return(
            <Box>
                <Text>No existing environments found.</Text>
            </Box>
        );
    }

    const multiSelectItems = Object.keys(environments).map(env => {
        return {
            label: env,
            value: env,
        };
    });

    const handleEnvironmentSubmission = (envs: { label: string; value: string; }[]) => {
        if (step === 2) {
            return;
        }

        const selectedEnvs = envs.map(e => e.value);
        setEnvironmentsToConfigure(selectedEnvs);
        setActiveEnvironment(selectedEnvs[0]!);
        setStep(2);
    };

    const handleEnvironmentConfigured = (env: string) => {
        const nextIndex = environmentsToConfigure.indexOf(env) + 1;
        if (environmentsToConfigure[nextIndex]) {
            setActiveEnvironment(environmentsToConfigure[nextIndex]!);
        }
    };

    return(
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text>Welcome to pan. Let's configure your project</Text>
            </Box>

            <WizardStep label="Select your environments" active={step === 1} done={step > 1} failed={step > 1 && environmentsToConfigure.length === 0}>
                <MultiSelect
                    text="Select the environments you'd like to use with pan:"
                    options={multiSelectItems}
                    required={true}
                    handleSubmit={handleEnvironmentSubmission}
                />
            </WizardStep>

            <WizardStep label="Configure environments" active={step === 2} done={step === 3}>
                <Box flexDirection="column">
                    {environmentsToConfigure.map((env, i) => (
                        <ConfigureEnvironment
                            key={i}
                            projectName={projectName}
                            env={env}
                            active={env === activeEnvironment}
                            handleDone={handleEnvironmentConfigured}
                        />
                    ))}
                </Box>
            </WizardStep>

            <Box display={ step === 3 ? "flex" : undefined} flexDirection="column" marginTop={1}>
                <Box marginBottom={1}>
                    <Text>
                        🎉 You are set up to use pan!
                    </Text>
                </Box>

                <Box flexDirection="column">
                    <Text>Commands:</Text>

                    <Box marginLeft={2} flexDirection="column">
                        <Text>pan create-env  create a new environment</Text>
                        <Text>pan deploy      deploy your project to an environment</Text>
                        <Text>pan destroy     destroy the resources in your environment</Text>
                        <Text>pan eject       eject into a raw pulumi program</Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Init;
