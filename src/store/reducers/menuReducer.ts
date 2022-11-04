import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";

interface IMenuState {
    openedMenu: string | null;
}

const initialState: IMenuState = {
    openedMenu: null
};

const tokenReducer = (state = initialState, action: IAction): IMenuState => {
    switch (action.type) {
        case MainActionTypes.SET_CURRENT_OPENED_MENU: {
            return {
                ...state,
                openedMenu: action.payload as string
            };
        }
        default:
            return { ...state };
    }
};
export default tokenReducer;
