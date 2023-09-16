import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

interface TextInputProps {
    label: string;
    handleSubmit: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, handleSubmit }) => {
    const [value, setValue] = useState("");

    useInput((input, key) => {
        if (key.backspace) {
            const newValue = value.slice(0, -1);
            setValue(newValue);
        }

        if (key.return) {
            handleSubmit(value);
        }

        const newValue = value + input;
        setValue(newValue);
    });

    return(
        <Box flexDirection="column">
            <Box>
                <Box marginRight={1}><Text>{label}:</Text></Box>
                <Text>{value}</Text>
            </Box>

            <Text>Press [ENTER] to continue</Text>
        </Box>
    );
};

export default TextInput;
