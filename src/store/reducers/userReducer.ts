import { SelectedKeyTypes } from "components/Users/userItem/userExtraCard/constants";
import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";

interface IUserState {
    selectedKey: string;
    currentUserFio: string;
    currentUserDataItemInfo: { [selectedKey: string]: any };
}

const initialState: IUserState = {
    selectedKey: SelectedKeyTypes.USER,
    currentUserFio: "",
    currentUserDataItemInfo: {}
};

const userReducer = (state = initialState, action: IAction): IUserState => {
    switch (action.type) {
        case MainActionTypes.SET_USER_SELECTED_KEY: {
            return {
                ...state,
                selectedKey: action.payload as string
            };
        }
        case MainActionTypes.SET_CURRENT_USER_FIO: {
            return {
                ...state,
                currentUserFio: action.payload as string
            };
        }
        case MainActionTypes.SET_CURRENT_USER_DATA_ITEM_INFO: {
            return {
                ...state,
                currentUserDataItemInfo: {
                    ...(action.payload as { [selectedKey: string]: any })
                }
            };
        }
        default:
            return { ...state };
    }
};
export default userReducer;

export const getSelectedKey = (state: IUserState) => state.selectedKey;
export const getUserDataItemInfo = (state: IUserState) => state.currentUserDataItemInfo;
export const getCurrentUserDataItemInfo = (state: IUserState) =>
    state.currentUserDataItemInfo?.[state.selectedKey];
