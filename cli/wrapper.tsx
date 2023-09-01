import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import { environment } from "./core/next/index.js";

interface WrapperProps {
    children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    const [isValidProject, setIsValidProject] = useState(false);

    useEffect(() => {
        const isNextJS = environment.isNextJSProject();
        setIsValidProject(isNextJS);
    }, []);

    if (!isValidProject) {
        return(
            <Box>
                <Text>
                    Not a valid next.js project
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
