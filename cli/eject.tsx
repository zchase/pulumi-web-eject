import React, { useState } from "react";
import { Box, Text } from "ink";
import Select, { SelectOption } from "./components/select.js";
import { useAppSelector, useAppDispatch } from "./store/index.js";
import { ejectProgram, getIsEjected, getPulumiError, getProjectName } from "./store/pulumi.js";
import { getEnvironments } from "./store/enviroment.js";
import Spinner from "ink-spinner";

interface EjectProps {

}

const Eject: React.FC<EjectProps> = ({}) => {
    const [optIn, setOptIn] = useState("");
    const isEjected = useAppSelector(getIsEjected);
    const hasError = useAppSelector(getPulumiError);
    const projectName = useAppSelector(getProjectName);
    const environments = useAppSelector(getEnvironments);
    const dispatch = useAppDispatch();

    const optInOptions: SelectOption[] = [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
    ];

    const handleOptInChoice = (opt: SelectOption) => {
        setOptIn(opt.value);

        if (opt.value === "yes") {
            dispatch(ejectProgram({
                projectName: projectName,
                environments: Object.keys(environments),
            }));
        }
    };

    const renderSelect = () => (
        <Select
            text="Would you like to continue?"
            options={optInOptions}
            handleSubmit={handleOptInChoice}
        ></Select>
    );

    const renderEject = () => (
        <Box>
            <Spinner type="dots" />
            <Text>Ejecting program...</Text>
        </Box>
    );

    const renderSection = () => {
        if (hasError) {
            return(
                <Box>
                    <Text color={"red"}>Error: </Text>
                    <Text>{hasError}</Text>
                </Box>
            );
        }

        if (isEjected) {
            return(
                <Box>
                    <Text>ejection complete</Text>
                </Box>
            );
        }

        switch (optIn) {
            case "yes":
                return renderEject();
            case "no":
                return undefined;
            default:
                return renderSelect();
        }
    };

    return(
        <Box flexDirection="column" width={"33%"}>
            <Box
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                borderColor={"yellowBright"}
                borderStyle={"single"}
                paddingRight={3}
                paddingLeft={3}
                marginBottom={1}
            >
                <Box marginBottom={1}>
                    <Text inverse color={"yellow"} bold={true}>Warning</Text>
                </Box>

                <Box marginBottom={1}>
                    <Text>
                        Ejecting the program should only be use when you are ready to
                        stop using pan and want full control over your cloud resources.
                    </Text>
                </Box>

                <Text>
                    Choosing `yes` will create a new directory, `infrastructure`,
                    that will contain your Pulumi program. To create, update, and destroy your
                    website you will need to use the Pulumi CLI.
                </Text>
            </Box>

            { renderSection() }
        </Box>
    );
};

export default Eject;
