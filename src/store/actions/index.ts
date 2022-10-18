import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";

export const UpdateToken = (payload: string | null): IAction => {
    return {
        type: MainActionTypes.SET_TOKEN,
        payload
    };
};

export const SetUserSelectedKey = (payload: string): IAction => {
    return {
        type: MainActionTypes.SET_USER_SELECTED_KEY,
        payload
    };
};

export const SetCurrentUserDataItemInfo = (payload: { [selectedKey: string]: any }): IAction => {
    return {
        type: MainActionTypes.SET_CURRENT_USER_DATA_ITEM_INFO,
        payload
    };
};
