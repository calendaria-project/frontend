import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";

interface IModalState {
    variableSalary: number | null;
    constantSalary: number | null;
}

const initialState: IModalState = {
    variableSalary: null,
    constantSalary: null
};

const tokenReducer = (state = initialState, action: IAction): IModalState => {
    switch (action.type) {
        case MainActionTypes.SET_MODAL_VARIABLE_SALARY: {
            return {
                ...state,
                variableSalary: action.payload as number
            };
        }
        case MainActionTypes.SET_MODAL_CONSTANT_SALARY: {
            return {
                ...state,
                constantSalary: action.payload as number
            };
        }
        default:
            return { ...state };
    }
};
export default tokenReducer;
