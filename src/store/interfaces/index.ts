import { MainAction, MainActionTypes } from "../types";

export interface IMainState {
    token: string | null;
}

export interface IContextProps {
    state: IMainState;
    dispatch: React.Dispatch<MainAction>;
}

export interface ISetTokenAction {
    type: MainActionTypes.SET_TOKEN;
    payload: string | null;
}
