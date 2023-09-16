import React from 'react';
import { Box, Text } from 'ink';

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



    return(
        <Text>
			Not implemented
		</Text>
    );
};

export default Deploy;
