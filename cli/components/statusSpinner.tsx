import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import figures from "figures";

interface StatusSpinnerProps {
    inProgress: boolean;
    done: boolean;
    failed?: boolean;
    text: string;
}

const StatusSpinner: React.FC<StatusSpinnerProps> = ({ inProgress, done, failed, text }) => {
    return(
        <Box>
            <Box display={inProgress || done || failed ? undefined : "flex"}>
                <Box marginRight={1}>
                    <Text>
                        {figures.checkboxCircleOff}
                    </Text>
                </Box>

                <Text>{text}</Text>
            </Box>

            <Box display={inProgress ? "flex" : undefined}>
                <Box marginRight={1}>
                    <Text color="blueBright">
                        <Spinner type="dots" />
                    </Text>
                </Box>

                <Text>{text}</Text>
            </Box>

            <Box display={done ? "flex" : undefined}>
                <Box marginRight={1}>
                    <Text color="green">
                        {figures.tick}
                    </Text>
                </Box>

                <Text>{text}</Text>
            </Box>

            <Box display={failed ? "flex" : undefined}>
                <Box marginRight={1}>
                    <Text color="red">
                        {figures.circleCross}
                    </Text>
                </Box>

                <Text>{text}</Text>
            </Box>
        </Box>
    );
};

export default StatusSpinner;
