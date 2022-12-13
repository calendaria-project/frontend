import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";
import { TLayoutModalData } from "data/types";
import { BASE_SUB_CONTRACT_INFO } from "data/constants";
import { CONTRACT, TContracts } from "data/constants";
import { IPositionDtoModel } from "interfaces";

interface IModalState {
    variableSalary: number | null;
    constantSalary: number | null;
    selectedContractType: TContracts;
    initialDivision: {
        divisionId: number | null;
        position: IPositionDtoModel | null;
    };
    divisionId: number | null;
    subContractLayout: TLayoutModalData[];
    simpleSubContractLayout: TLayoutModalData[];
}

const initialState: IModalState = {
    variableSalary: null,
    constantSalary: null,
    selectedContractType: CONTRACT,
    initialDivision: {
        divisionId: null,
        position: null
    },
    divisionId: null,
    subContractLayout: BASE_SUB_CONTRACT_INFO,
    simpleSubContractLayout: BASE_SUB_CONTRACT_INFO
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
        case MainActionTypes.SET_SELECTED_CONTRACT_TYPE: {
            return {
                ...state,
                selectedContractType: action.payload as TContracts
            };
        }
        case MainActionTypes.SET_SUB_CONTRACT_INITIAL_DIVISION: {
            return {
                ...state,
                initialDivision: action.payload as {
                    divisionId: number;
                    position: IPositionDtoModel;
                }
            };
        }
        case MainActionTypes.SET_SUB_CONTRACT_DIVISION_ID: {
            return {
                ...state,
                divisionId: action.payload as number
            };
        }
        case MainActionTypes.SET_MODAL_SUB_CONTRACT_LAYOUT: {
            return {
                ...state,
                subContractLayout: action.payload as TLayoutModalData[]
            };
        }
        case MainActionTypes.SET_SIMPLE_ADD_MODAL_SUB_CONTRACT_LAYOUT: {
            return {
                ...state,
                simpleSubContractLayout: action.payload as TLayoutModalData[]
            };
        }
        default:
            return { ...state };
    }
};
export default tokenReducer;
