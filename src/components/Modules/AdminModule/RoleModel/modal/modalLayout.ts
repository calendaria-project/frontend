import { dictionaryCodesEnum } from "data/enums";
import { TLayoutModalData } from "data/types";
import { layoutConstantTypes } from "data/enums";

export const modalLayout: TLayoutModalData[] = [
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "name",
        placeholder: "Название",
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "description",
        placeholder: "Описание"
    },
    {
        type: layoutConstantTypes.SELECT,
        dictionaryCode: dictionaryCodesEnum.RISK_LEVEL,
        propertyName: "riskLevel",
        placeholder: "Уровень риска",
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "owner",
        placeholder: "Владелец",
        required: true
    },
    {
        type: layoutConstantTypes.INPUT,
        propertyName: "source",
        placeholder: "Источник",
        required: true
    }
];
