import store, { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index.js";
import { file } from "../core/utils/index.js";
import { cmd } from "../core/index.js";

const { createSlice, createAsyncThunk } = store;

interface PulumiActionMessage {
    name: string;
    resource: string;
    status: string;
}

export interface PulumiState {
    projectName: string;
    stackName: string;
    error: string | undefined;
    isEjected: boolean;
    messages: { [key: string]: PulumiActionMessage };
}

const initialState = (): PulumiState => {
    const projectName = JSON.parse(file.readFileToString("package.json")).name;

    return {
        projectName,
        stackName: "",
        messages: {},
        error: undefined,
        isEjected: false,
    };
};

export const pulumiSlice = createSlice({
    name: "pulumi",
    initialState: initialState(),
    extraReducers: (pulumi) => {
        pulumi
            .addCase(ejectProgram.rejected, (state, action) => {
                console.log(action);
                state.error = action.error.message;
            })
            .addCase(ejectProgram.fulfilled, (state, _action) => {
                state.isEjected = true;
            });
    },
    reducers: {
        setStackName: (state, action: PayloadAction<string>) => {
            state.stackName = action.payload;
        },
        addMessage: (state, action: PayloadAction<{ key: string; message: PulumiActionMessage }>) => {
            state.messages[action.payload.key] = action.payload.message;
        },
    },
});

export const getProjectName = (state: RootState) => state.pulumi.projectName;
export const getStackName = (state: RootState) => state.pulumi.stackName;
export const getPulumiError = (state: RootState) => state.pulumi.error;
export const getIsEjected = (state: RootState) => state.pulumi.isEjected;
export const getMessages = (state: RootState) => state.pulumi.messages;

interface EjectProgramArgs {
    projectName: string;
    environments: string[];
}

export const ejectProgram = createAsyncThunk("pulumi/ejectProgram", async (args: EjectProgramArgs) => {
    return await cmd.eject.ejectProgram(args.projectName, args.environments);
});

export const { setStackName, addMessage } = pulumiSlice.actions;
export default pulumiSlice.reducer;
