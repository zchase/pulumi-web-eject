import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

type TableData = string | number | boolean | null | undefined;

export type TableItem = { [key: string]: TableData };

interface TableProps<T extends TableItem> {
    data: T[];
    columns: (keyof T)[];
    done: boolean;
}

export default function PulumiActionTable<T extends TableItem>({ data, columns, done }: TableProps<T>) {
    const tableColumns = columns.map(c => {
        const values = data.map(d => d[c]);
        return [c, ...values];
    });

    const renderItem = (text: any, i: number) => {
        let color = "white";
        let bold = false;
        let spinner = false;
        switch (text) {
            case "creating":
                color = "greenBright";
                spinner = true;

                // It doesn't look like a log message is delivered
                // from automation api when the synced folder is finished.
                // So we have a done prop to ensure it gets logged properly.
                if (done) {
                    text = "created";
                    color = "green";
                    bold = true;
                    spinner = false;
                }
                break;
            case "created":
                color = "green";
                bold = true;
                break;
            case "deleting":
                color = "redBright";
                spinner = true;

                // It doesn't look like a log message is delivered
                // from automation api when the synced folder is finished.
                // So we have a done prop to ensure it gets logged properly.
                if (done) {
                    text = "deleted";
                    color = "redBright";
                    spinner = true;
                    spinner = false;
                }
                break;
            case "deleted":
                color = "red";
                bold = true;
                break;
        }

        return(
            <Box
                key={i}
                borderStyle="classic"
                borderLeft={false}
                borderRight={false}
                borderTop={false}
                borderBottom={i === 0}
            >
                <Text bold={bold} color={color}>{text}</Text>
                { spinner ? <Box marginLeft={1}><Spinner type="line" /></Box> : undefined }
            </Box>
        );
    };

    return(
        <Box
            borderStyle="classic"
        >
            {tableColumns.map((col, i) => (
                <Box key={i}
                    flexDirection="column"
                    marginRight={1}
                    paddingRight={1}
                    paddingLeft={1}
                    borderStyle="classic"
                    borderLeft={i > 0}
                    borderRight={false}
                    borderTop={false}
                    borderBottom={false}
                >
                    {col.map(renderItem)}
                </Box>
            ))}
        </Box>
    );
}
