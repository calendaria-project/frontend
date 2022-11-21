import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";

interface IMenuState {
    layoutMenu: string | null;
    openedMenu: string | null;
    tabActiveKey: string;
}

const initialState: IMenuState = {
    layoutMenu: null,
    openedMenu: null,
    tabActiveKey: sessionStorage.getItem("directoriesActiveTabId") || "1"
};

const menuReducer = (state = initialState, action: IAction): IMenuState => {
    switch (action.type) {
        case MainActionTypes.SET_CURRENT_LAYOUT_MENU: {
            return {
                ...state,
                layoutMenu: action.payload as string
            };
        }
        case MainActionTypes.SET_CURRENT_OPENED_MENU: {
            return {
                ...state,
                openedMenu: action.payload as string
            };
        }
        case MainActionTypes.SET_DICTIONARY_TAB_ACTIVE_KEY: {
            return {
                ...state,
                tabActiveKey: action.payload as string
            };
        }
        default:
            return { ...state };
    }
};
export default menuReducer;
