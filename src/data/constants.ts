import { TLayoutModalData } from "./types";
import { dictionaryCodesEnum, layoutConstantTypes } from "./enums";

export const ALL = "ALL";
export const ARCHIVE = "ARCHIVE";
export const ACTIVE = "ACTIVE";

export const SALARY_VARIABLE_PART = "salaryVariablePart";
export const SALARY_CONSTANT_PART = "salaryConstantPart";
export const SALARY_VARIABLE_PERCENT = "salaryVariablePercent";
export const SALARY_CONSTANT_PERCENT = "salaryConstantPercent";
export const SALARY = "salary";

export const CONTRACT = "CONTRACT";
export const SUB_CONTRACT = "SUB_CONTRACT";
export type TContracts = typeof CONTRACT | typeof SUB_CONTRACT;

export const SHORTENED_CONTRACT_ARRAY = [CONTRACT, SUB_CONTRACT];

export const REDUCED_CONTRACT_INFO: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.SELECT,
        propertyName: "contractType",
        dictionaryCode: dictionaryCodesEnum.CONTRACT_TYPE,
        placeholder: "Тип договора",
        disabled: true,
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "contractNum",
        placeholder: "Номер договора",
        required: true
    },
    {
        type: layoutConstantTypes.DATE,
        propertyName: "contractDate",
        placeholder: "Дата начала договора",
        required: true
    }
];

export const BASE_SUB_CONTRACT_INFO: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.SELECT,
        propertyName: "contractType",
        dictionaryCode: dictionaryCodesEnum.CONTRACT_TYPE,
        placeholder: "Тип договора",
        disabled: true,
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "contractNum",
        placeholder: "Номер доп соглашения",
        required: true
    },
    {
        type: layoutConstantTypes.DATE,
        propertyName: "contractDate",
        placeholder: "Дата доп соглашения",
        required: true
    },
    {
        type: layoutConstantTypes.MULTIPLE_SELECT,
        propertyName: "formTypes",
        dictionaryCode: dictionaryCodesEnum.CONTRACT_FORM_TYPE,
        placeholder: "Данные для изменения"
    }
];

export const ADDITIONAL_SALARY: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.TITLE,
        placeholder: "Оплата труда",
        propertyName: ""
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "salary",
        inputType: "number",
        placeholder: "Общий оклад",
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        placeholder: "KPI",
        inputType: "number",
        span: 6,
        suffix: "%",
        propertyName: "salaryConstantPercent",
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "salaryConstantPart",
        disabled: true,
        inputType: "number",
        placeholder: "Основная заработная плата",
        span: 18
    },
    {
        type: layoutConstantTypes.INPUT,
        placeholder: "KPI",
        inputType: "number",
        span: 6,
        suffix: "%",
        propertyName: "salaryVariablePercent",
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "salaryVariablePart",
        disabled: true,
        inputType: "number",
        span: 18,
        placeholder: "Переменная заработная плата"
    }
];

export const ADDITIONAL_NORM: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.TITLE,
        placeholder: "Нормирование труда",
        propertyName: ""
    },
    {
        type: layoutConstantTypes.SELECT,
        propertyName: "normType",
        dictionaryCode: dictionaryCodesEnum.CONTRACT_NORM_TYPE,
        placeholder: "Не относится к тяжелым"
    },
    {
        type: layoutConstantTypes.SELECT,
        propertyName: "normCondition",
        dictionaryCode: dictionaryCodesEnum.CONTRACT_NORM_CONDITION,
        placeholder: "Не выполняется во вредных или опасных условиях"
    }
];

export const ADDITIONAL_WORKING_REGIME: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.TITLE,
        placeholder: "Режим рабочего времени и отдыха",
        propertyName: ""
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "workingDaysCnt",
        inputType: "number",
        placeholder: "Количество рабочих дней в неделю",
        pattern: new RegExp(/^[1-7]$/g),
        patternMessage: "Введите число от 1 до 7",
        maxLength: 1
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "workingHoursCnt",
        inputType: "number",
        placeholder: "Количество часов в неделю",
        pattern: new RegExp(/^([1-9]|[0-9]{2}|1[0-6][0-8])$/g),
        patternMessage: "Введите число от 1 до 168",
        maxLength: 3
    }
];

export const ADDITIONAL_TRANSFER: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.TITLE,
        placeholder: "Перевод работника",
        propertyName: ""
    },
    {
        type: layoutConstantTypes.DIVISION_SELECT,
        propertyName: "division",
        dictionaryCode: "division",
        placeholder: "Подразделение",
        required: true
    },
    {
        type: layoutConstantTypes.POSITION_SELECT,
        propertyName: "position",
        dictionaryCode: "position",
        placeholder: "Должность",
        required: true
    }
];

export const ADDITIONAL_WORK_TYPE: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.TITLE,
        placeholder: "Тип работы",
        propertyName: ""
    },
    {
        type: layoutConstantTypes.SELECT,
        propertyName: "workType",
        dictionaryCode: dictionaryCodesEnum.WORK_TYPE,
        placeholder: "Основная"
    }
];
