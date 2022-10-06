import { MainAction, MainActionTypes } from "../types";

export const UpdateToken = (payload: string | null): MainAction => {
    return {
        type: MainActionTypes.SET_TOKEN,
        payload
    };
};
