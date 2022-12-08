import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";
import { TLayoutModalData } from "data/types";

interface IModalState {
    variableSalary: number | null;
    constantSalary: number | null;
    contractAddLayout: TLayoutModalData[];
}

const initialState: IModalState = {
    variableSalary: null,
    constantSalary: null,
    contractAddLayout: []
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
        case MainActionTypes.SET_MODAL_SIMPLE_ADD_CONTRACT_LAYOUT: {
            return {
                ...state,
                contractAddLayout: action.payload as TLayoutModalData[]
            };
        }
        default:
            return { ...state };
    }
};
export default tokenReducer;
