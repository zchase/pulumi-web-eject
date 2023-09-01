import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import figures from "figures";

interface MultiSelectOption {
    label: string;
    value: string;
}

interface MultiSelectProps {
    text?: string;
    options: MultiSelectOption[];
    required?: boolean;
    handleSubmit: (chosen: MultiSelectOption[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ text, options, required, handleSubmit }) => {
    const [ selected, setSelected ] = useState(options[0]);
    const [ chosen, setChosen ] = useState<MultiSelectOption[]>([]);
    const [ hasError, setHasError ] = useState(false);
    const label = text ?? "Please select an option";

    useInput((input, key) => {
        setHasError(false);
        const selectedIndex = options.findIndex(opt => opt.value === selected?.value);

        if (key.upArrow && selectedIndex > 0) {
            const newSelectedIndex = selectedIndex - 1;
            setSelected(options[newSelectedIndex]);
        }

        if (key.downArrow && selectedIndex !== (options.length - 1)) {
            const newSelectedIndex = selectedIndex + 1;
            setSelected(options[newSelectedIndex]);
        }

        if (input === " ") {
            const isAlreadyChosen = chosen.findIndex(c => c.value === selected!.value);

            if (isAlreadyChosen !== -1) {
                const newChosen = [ ...chosen ].filter(c => c.value !== selected!.value);
                setChosen(newChosen);
                return;
            }

            setChosen([ ...chosen, selected! ]);
        }

        if (key.return) {
            if (required && chosen.length === 0) {
                setHasError(true);
                return;
            }

            handleSubmit(chosen);
        }
    });

    const renderOptions = (opt: MultiSelectOption, key: number) => {
        const isSelected = opt.value === selected?.value;
        const isChosen = chosen.find(c => c.value === opt.value);

        return(
            <Box key={key} marginLeft={1}>
                <Box marginRight={2}>
                    <Text color={isSelected ? "blue" : undefined}>
                        { isSelected ? figures.pointer : " " }
                    </Text>
                </Box>

                <Box marginRight={1}>
                    <Text color="green">{ isChosen ? figures.circleFilled : figures.circle }</Text>
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
                <Text>Press [SPACE] to choose an environment and press [ENTER] when you are finished choosing.</Text>
            </Box>
            <Box display={ hasError ? "flex" : undefined }>
                <Text color="red">You must select at least one option.</Text>
            </Box>
        </Box>
    );
};

export default MultiSelect;
