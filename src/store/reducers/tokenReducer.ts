import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";

interface ITokenState {
    token: string | null;
}

const initialState: ITokenState = {
    token: null
};

const tokenReducer = (state = initialState, action: IAction): ITokenState => {
    switch (action.type) {
        case MainActionTypes.SET_TOKEN: {
            return {
                ...state,
                token: action.payload as string
            };
        }
        default:
            return { ...state };
    }
};
export default tokenReducer;
