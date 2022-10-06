import { IMainState } from "../interfaces";
import { MainAction, MainActionTypes } from "../types";

export default (state: IMainState, action: MainAction): IMainState => {
    switch (action.type) {
        case MainActionTypes.SET_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        default:
            return { ...state };
    }
};
