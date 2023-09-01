import toolkit, { ThunkAction, Action } from "@reduxjs/toolkit";
import environmentReducer from "./enviroment.js";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const { configureStore } = toolkit;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const store = configureStore({
    reducer: {
        enviroments: environmentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
