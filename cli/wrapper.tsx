import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import { project } from "./core/framework/index.js";

interface WrapperProps {
    children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    const [isValidProject, setIsValidProject] = useState(false);

    useEffect(() => {
        const isNextJS = project.isValidProject();
        setIsValidProject(isNextJS);
    }, []);

    if (!isValidProject) {
        return(
            <Box>
                <Text>
                    Not a valid project
                </Text>
            </Box>
        );
    }

    return(
        <Box>
            { children }
        </Box>
    );
};

export default Wrapper;
