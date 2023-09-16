import React from "react";
import { Box, Text } from "ink";
import figures from "figures";

interface WizardStepProps {
    label: string;
    children: React.ReactNode;
    active?: boolean;
    done?: boolean;
    failed?: boolean;
}

const WizardStep: React.FC<WizardStepProps> = ({ label, children, active, done, failed }) => {
    let color = "gray";
    let icon = figures.checkboxCircleOff;
    if (active) {
        color = "blue";
    }

    if (done) {
        color = "green";
        icon = figures.tick;
    }

    if (failed) {
        color = "red";
        icon = figures.cross;
    }

    return(
        <Box flexDirection="column" marginBottom={active ? 2 : 0}>
            <Box>
                <Box marginRight={2} marginBottom={active ? 1 : 0}>
                    <Text color={color}>{ icon }</Text>
                </Box>
                <Box>
                    <Text>{label}</Text>
                </Box>
            </Box>

            <Box flexDirection="column" marginLeft={3} display={ active ? "flex" : undefined}>
                {active ? children : undefined }
            </Box>
        </Box>
    );
};

export default WizardStep;
