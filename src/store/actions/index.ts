import { MainActionTypes } from "../types";
import { IAction } from "../interfaces";
import { TLayoutModalData } from "data/types";
import { TContracts } from "../../data/values";
import { IPositionDtoModel } from "../../interfaces";

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

export const SetCurrentUserFio = (payload: string): IAction => {
    return {
        type: MainActionTypes.SET_CURRENT_USER_FIO,
        payload
    };
};

export const SetCurrentUserDataItemInfo = (payload: { [selectedKey: string]: any }): IAction => {
    return {
        type: MainActionTypes.SET_CURRENT_USER_DATA_ITEM_INFO,
        payload
    };
};

export const SetCurrentLayoutMenu = (payload: string): IAction => {
    return {
        type: MainActionTypes.SET_CURRENT_LAYOUT_MENU,
        payload
    };
};

export const SetCurrentOpenedMenu = (payload: string): IAction => {
    return {
        type: MainActionTypes.SET_CURRENT_OPENED_MENU,
        payload
    };
};

export const SetDictionaryTabActiveKey = (payload: string): IAction => {
    return {
        type: MainActionTypes.SET_DICTIONARY_TAB_ACTIVE_KEY,
        payload
    };
};

export const SetModalVariableSalary = (payload: number): IAction => {
    return {
        type: MainActionTypes.SET_MODAL_VARIABLE_SALARY,
        payload
    };
};

export const SetModalConstantSalary = (payload: number): IAction => {
    return {
        type: MainActionTypes.SET_MODAL_CONSTANT_SALARY,
        payload
    };
};

export const SetSelectedContractType = (payload: TContracts): IAction => {
    return {
        type: MainActionTypes.SET_SELECTED_CONTRACT_TYPE,
        payload
    };
};

export const SetSubContractInitialDivisionId = (payload: {
    divisionId: number;
    position: IPositionDtoModel;
}): IAction => {
    return {
        type: MainActionTypes.SET_SUB_CONTRACT_INITIAL_DIVISION,
        payload
    };
};

export const SetSubContractDivisionId = (payload: number): IAction => {
    return {
        type: MainActionTypes.SET_SUB_CONTRACT_DIVISION_ID,
        payload
    };
};

export const SetModalSubContractLayout = (payload: TLayoutModalData[]): IAction => {
    return {
        type: MainActionTypes.SET_MODAL_SUB_CONTRACT_LAYOUT,
        payload
    };
};

export const SetSimpleAddModalSubContractLayout = (payload: TLayoutModalData[]): IAction => {
    return {
        type: MainActionTypes.SET_SIMPLE_ADD_MODAL_SUB_CONTRACT_LAYOUT,
        payload
    };
};
