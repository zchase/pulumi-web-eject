import store from "@reduxjs/toolkit";
import { RootState } from "./index.js";
import { file } from "../core/utils/index.js";
import { environment } from "../core/next/index.js";
import { stack } from "../core/pulumi/index.js";

const { createSlice, createAsyncThunk } = store;

export interface EnvironmentsState {
    projectName: string;
    environments: Record<string, environment.NextEnvironment>;
    configuredEnvironments: string[];
    error?: Error;
}

const initialState = (): EnvironmentsState => {
    const envs = environment.readNextEnvironment();
    const projectName = JSON.parse(file.readFileToString("package.json")).name;

    return {
        projectName,
        environments: envs,
        configuredEnvironments: [],
    };
};

export const environmentsSlice = createSlice({
    name: "enviroments",
    initialState: initialState(),
    extraReducers: (environments) => {
        environments
            .addCase(configureEnvironment.fulfilled, (state, action) => {
                state.configuredEnvironments.push(action.payload)
            });
    },
    reducers: {},
});

export const getProjectName = (state: RootState) => state.enviroments.projectName;
export const getEnvironments = (state: RootState) => state.enviroments.environments;
export const getEnvironment = (name: string) => (state: RootState) => state.enviroments.environments[name];
export const getConfiguredEnvironments= (state: RootState) => state.enviroments.configuredEnvironments;
export const getError = (state: RootState) => state.enviroments.error;

interface ConfigureEnvironmentArgs {
    env: string;
    projectName: string;
    config: stack.ConfigMap;
}

export const configureEnvironment = createAsyncThunk("environments/configureEnvironment", async (args: ConfigureEnvironmentArgs): Promise<string> => {
    const pEnv = await stack.initStack(args.projectName, args.env);
    await stack.setInitialStackConfig(pEnv, args.config);
    return args.env;
});

export default environmentsSlice.reducer;
