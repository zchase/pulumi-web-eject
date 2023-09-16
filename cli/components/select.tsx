import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import figures from "figures";

export interface SelectOption<T = string> {
    label: string;
    value: T;
}

interface SelectProps {
    text?: string;
    options: SelectOption[];
    handleSubmit: (chosen: SelectOption<any>) => void;
}

const Select: React.FC<SelectProps> = ({ text, options, handleSubmit }) => {
    const [ selected, setSelected ] = useState(options[0]);
    const label = text ?? "Please select an option";

    useInput((_input, key) => {
        const selectedIndex = options.findIndex(opt => opt.value === selected?.value);

        if (key.upArrow && selectedIndex > 0) {
            const newSelectedIndex = selectedIndex - 1;
            setSelected(options[newSelectedIndex]);
        }

        if (key.downArrow && selectedIndex !== (options.length - 1)) {
            const newSelectedIndex = selectedIndex + 1;
            setSelected(options[newSelectedIndex]);
        }

        if (key.return) {
            handleSubmit(selected!);
        }
    });

    const renderOptions = (opt: SelectOption, key: number) => {
        const isSelected = opt.value === selected?.value;

        return(
            <Box key={key} marginLeft={1}>
                <Box marginRight={2}>
                    <Text color={isSelected ? "blue" : undefined}>
                        { isSelected ? figures.pointer : " " }
                    </Text>
                </Box>

                <Box>
                    <Text color={ isSelected ? "blue" : undefined }>{ opt.label }</Text>
                </Box>
            </Box>
        );
    };

    return(
        <Box flexDirection="column">
            <Text>{ label }</Text>

            <Box flexDirection="column" marginTop={1}>
                {options.map(renderOptions)}
            </Box>

            <Box marginTop={1}>
                <Text>Press [ENTER] to select your option.</Text>
            </Box>
        </Box>
    );
};

export default Select;
