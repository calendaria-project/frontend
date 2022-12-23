import { TLayoutModalData } from "data/types";
import {
    //dictionaryCodesEnum,
    layoutConstantTypes
} from "data/enums";

import { ONE_C, RATE, ROLES, SERVICE_NUMBER, TENDERIX, VIEW_MODE } from "data/constants";

export const ADD_REQUEST_LAYOUT: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.SELECT,
        propertyName: "forWho", //edit
        dictionaryCode: "", //edit
        placeholder: "Для кого"
        // required: true
    },
    {
        type: layoutConstantTypes.SELECT,
        propertyName: "reqType", //edit
        dictionaryCode: "", //edit
        placeholder: "Тип заявки"
        // required: true
    },
    {
        type: layoutConstantTypes.DATE,
        propertyName: "deadline", //edit
        placeholder: "Дедлайн заявки",
        required: true
    },
    {
        type: layoutConstantTypes.CHECKBOX,
        propertyName: "cardScud", //edit
        placeholder: "Карточка СКУД"
    },
    {
        type: layoutConstantTypes.CHECKBOX,
        propertyName: SERVICE_NUMBER, //edit
        placeholder: "Служебный номер"
    },
    {
        type: layoutConstantTypes.SELECT,
        propertyName: RATE, //edit
        dictionaryCode: "", //edit
        placeholder: "Тариф"
        // required: true
    },
    {
        type: layoutConstantTypes.TITLE,
        propertyName: "",
        placeholder: "Доступ к информационным системам"
    },
    {
        type: layoutConstantTypes.CHECKBOX,
        propertyName: "corpMail", //edit
        placeholder: "Корпоративная почта (mail.alageum.kz)"
    },
    {
        type: layoutConstantTypes.CHECKBOX,
        propertyName: "bitrix", //edit
        placeholder: "Битрикс24"
    },
    {
        type: layoutConstantTypes.CHECKBOX,
        propertyName: ONE_C, //edit
        placeholder: "1C"
    },
    {
        type: layoutConstantTypes.SELECT,
        propertyName: VIEW_MODE, //edit
        dictionaryCode: "", //edit
        placeholder: "Режим просмотра"
        // required: true
    },
    {
        type: layoutConstantTypes.CHECKBOX,
        propertyName: TENDERIX, //edit
        placeholder: "Tenderix"
    },
    {
        type: layoutConstantTypes.SELECT,
        propertyName: ROLES, //edit
        dictionaryCode: "", //edit
        placeholder: "Роль"
        // required: true
    },
    {
        type: layoutConstantTypes.CHECKBOX,
        propertyName: "aData", //edit
        placeholder: "Adata"
    },
    {
        type: layoutConstantTypes.TEXTAREA,
        propertyName: "description",
        placeholder: "Комментарии к заявке"
    }
];
