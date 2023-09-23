import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import { useAppSelector } from "./store/index.js";
import { getEnvironments, getConfiguredEnvironments, getProjectName } from "./store/enviroment.js";
import ConfigureEnvironment from "./components/configureEnv.js";
import Select, { SelectOption } from "./components/select.js";
import MultiSelect, { MultiSelectOption } from "./components/multiSelect.js";
import WizardStep from "./components/wizardStep.js";
import TextInput from "./components/textInput.js";

type Cloud = "aws" | "azure" | "gcp";

interface InitProps {
    cliArgs: {};
}

const Init: React.FC<InitProps> = ({}) => {
    const [step, setStep] = useState(1);
    const [cloud, setCloud] = useState<Cloud | undefined>();
    const [additionalConfig, setAdditionalConfig] = useState<Record<string, { value: string; secret: boolean; }>>({});
    const [additionalConfigLabel, setAdditionalConfigLabel] = useState("");
    const [environmentsToConfigure, setEnvironmentsToConfigure] = useState<string[]>([]);
    const [activeEnvironment, setActiveEnvironment] = useState("");
    const environments = useAppSelector(getEnvironments);
    const configuredEnvironments = useAppSelector(getConfiguredEnvironments);
    const projectName = useAppSelector(getProjectName);

    useEffect(() => {
        if (step === 4 && environmentsToConfigure.length === configuredEnvironments.length) {
            setStep(5);
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

    const handleEnvironmentSubmission = (envs: MultiSelectOption[]) => {
        const selectedEnvs = envs.map(e => e.value);
        setEnvironmentsToConfigure(selectedEnvs);
        setActiveEnvironment(selectedEnvs[0]!);
        setStep(4);
    };

    const handleEnvironmentConfigured = (env: string) => {
        const nextIndex = environmentsToConfigure.indexOf(env) + 1;
        if (activeEnvironment === env && environmentsToConfigure[nextIndex]) {
            setActiveEnvironment(environmentsToConfigure[nextIndex]!);
        }
    };

    const cloudOptions: SelectOption<Cloud>[] = [
        { label: "AWS", value: "aws" },
        { label: "Azure", value: "azure" },
        { label: "GCP", value: "gcp" },
    ];

    const handleCloudChosen = (cloud: SelectOption<Cloud>) => {
        if (cloud.value === "aws") {
            setAdditionalConfigLabel("AWS region");
        }

        if (cloud.value === "azure") {
            setAdditionalConfigLabel("Azure location");
        }

        if (cloud.value === "gcp") {
            setAdditionalConfigLabel("Google Cloud project")
        }

        setCloud(cloud.value);
        setStep(2);
    };

    const handleCloudConfig = (value: string) => {
        const config: Record<string, { value: string; secret: boolean; }> = {};

        if (cloud === "aws") {
            config["aws:region"] = { value, secret: false };
        }

        if (cloud === "azure") {
            config["azure:location"] = { value, secret: false };
        }

        if (cloud === "gcp") {
            config["gcp:project"] = { value, secret: false };
        }

        setAdditionalConfig(config);
        setStep(3);
    };

    return(
        <Box flexDirection="column">
            <Box marginBottom={1}>
                <Text>Welcome to pan. Let's configure your project</Text>
            </Box>

            <WizardStep label="Pick your cloud" active={step === 1} done={step > 1}>
                <Select
                    text="What cloud are you using?"
                    options={cloudOptions}
                    handleSubmit={handleCloudChosen}
                />
            </WizardStep>

            <WizardStep label="Configure your cloud" active={step === 2} done={step > 2}>
                <TextInput
                    label={additionalConfigLabel}
                    handleSubmit={handleCloudConfig}
                ></TextInput>
            </WizardStep>

            <WizardStep label="Select your environments" active={step === 3} done={step > 3} failed={step > 3 && environmentsToConfigure.length === 0}>
                <MultiSelect
                    text="Select the environments you'd like to use with pan:"
                    options={multiSelectItems}
                    required={true}
                    handleSubmit={handleEnvironmentSubmission}
                />
            </WizardStep>

            <WizardStep label="Configure environments" active={step === 4} done={step > 4}>
                <Box flexDirection="column">
                    {environmentsToConfigure.map((env, i) => (
                        <ConfigureEnvironment
                            key={i}
                            projectName={projectName}
                            env={env}
                            active={env === activeEnvironment}
                            additionalConfig={additionalConfig}
                            handleDone={handleEnvironmentConfigured}
                        />
                    ))}
                </Box>
            </WizardStep>

            <Box display={ step === 5 ? "flex" : undefined} flexDirection="column" marginTop={1}>
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
