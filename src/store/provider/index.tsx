import React, { useReducer } from "react";
import { MainContext } from "..";
import { IMainState } from "../interfaces";
import MainReducer from "../reducer";

export interface IMainProvider {
    children: React.ReactNode;
}

const initialState: IMainState = {
    token: null
};

const MainProvider: React.FC<IMainProvider> = ({ children }) => {
    const [state, dispatch] = useReducer(MainReducer, initialState);

    return <MainContext.Provider value={{ state, dispatch }}>{children}</MainContext.Provider>;
};

export default MainProvider;
