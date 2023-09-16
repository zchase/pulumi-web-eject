import store from "@reduxjs/toolkit";
import { RootState } from "./index.js";
import { file } from "../core/utils/index.js";
import { cmd } from "../core/index.js";

const { createSlice, createAsyncThunk } = store;

interface PulumiAction {
    type: "preview" | "update" | "destroy";
    messages: string[];
}

export interface PulumiState {
    projectName: string;
    stackName: string;
    actions: PulumiAction[];
    currentAction: PulumiAction | undefined;
    error: string | undefined;
    isEjected: boolean;
}

const initialState = (): PulumiState => {
    const projectName = JSON.parse(file.readFileToString("package.json")).name;

    return {
        projectName,
        stackName: "",
        actions: [],
        currentAction: undefined,
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
        setStackName: (state, action) => {
            state.stackName = action.payload;
        },
    },
});

export const getProjectName = (state: RootState) => state.pulumi.projectName;
export const getStackName = (state: RootState) => state.pulumi.stackName;
export const getCurrentAction = (state: RootState) => state.pulumi.currentAction;
export const getPulumiError = (state: RootState) => state.pulumi.error;
export const getIsEjected = (state: RootState) => state.pulumi.isEjected;

interface PulumiActionArgs {}

export const runPreview = createAsyncThunk("pulumi/runPreview", async (_args: PulumiActionArgs) => {});

export const runUpdate = createAsyncThunk("pulumi/runUpdate", async (_args: PulumiActionArgs) => {});

export const runDestroy = createAsyncThunk("pulumi/runDestroy", async (_args: PulumiActionArgs) => {});

interface EjectProgramArgs {
    projectName: string;
    environments: string[];
}

export const ejectProgram = createAsyncThunk("pulumi/ejectProgram", async (args: EjectProgramArgs) => {
    return await cmd.eject.ejectProgram(args.projectName, args.environments);
});

export default pulumiSlice.reducer;
