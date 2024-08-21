import {createSlice } from "@reduxjs/toolkit";
import { RootState } from "../Store";

interface IAuthenticationEntity {

    isAuthenticated: boolean;

};

const initialState = {

    "isAuthenticated": false

} as IAuthenticationEntity;

export const reducer = createSlice({
    "name": "authentication",
    initialState,
    "reducers": {

        "logIn": (state) => {

            state.isAuthenticated = true;
            return state;

        },
        "logOut": (state) => {

            state.isAuthenticated = false;
            return state;

        }

    }
});

export const selectIsAuthenticated = (state: RootState) => {

    return state.authentication.isAuthenticated;

};

export const { logIn, logOut } = reducer.actions;