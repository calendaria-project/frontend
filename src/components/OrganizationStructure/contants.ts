import { nodeTypeEnum } from "data/enums";

interface IStructureLayout {
    [key: string]: {
        [key: string]: Array<{
            name: string;
            placeholder?: string;
            label?: string;
            required?: boolean;
        }>;
    };
}

export enum layoutOptions {
    EDIT_COMPANY = "EDIT_COMPANY",
    EDIT_DIVISION = "EDIT_DIVISION",
    EDIT_DIVISION_UNIT = "EDIT_DIVISION_UNIT",
    ADD_DIVISION = "ADD_DIVISION",
    ADD_DIVISION_UNIT = "ADD_DIVISION_UNIT",
    DELETE_DIVISION = "DELETE_DIVISION",
    DELETE_DIVISION_UNIT = "DELETE_DIVISION_UNIT"
}

export type TLayoutOptions =
    | layoutOptions.EDIT_DIVISION
    | layoutOptions.EDIT_COMPANY
    | layoutOptions.EDIT_DIVISION_UNIT
    | layoutOptions.ADD_DIVISION
    | layoutOptions.ADD_DIVISION_UNIT
    | layoutOptions.DELETE_DIVISION
    | layoutOptions.DELETE_DIVISION_UNIT;

export const addingOptions = [layoutOptions.ADD_DIVISION, layoutOptions.ADD_DIVISION_UNIT];
export const editingOptions = [
    layoutOptions.EDIT_COMPANY,
    layoutOptions.EDIT_DIVISION,
    layoutOptions.EDIT_DIVISION_UNIT
];
export const deletingOptions = [layoutOptions.DELETE_DIVISION_UNIT, layoutOptions.DELETE_DIVISION];

export const structureLayout: IStructureLayout = {
    [nodeTypeEnum.COMPANY]: {
        [layoutOptions.EDIT_COMPANY]: [
            { name: "isCounterparty", label: "Контрагент", required: true },
            { name: "bin", placeholder: "БИН", required: true },
            { name: "nameRu", placeholder: "На Русском", required: true },
            { name: "nameKz", placeholder: "На Казахском", required: true },
            { name: "nameEn", placeholder: "На Английском" },
            { name: "companyType", placeholder: "Тип компании", required: true },
            { name: "companyIndex", placeholder: "Индекс", required: true },
            { name: "fax", placeholder: "Факс" },
            { name: "email", placeholder: "Почта", required: true },
            { name: "companyAddresses" }
        ],
        [layoutOptions.ADD_DIVISION]: [
            { name: "code", label: "Код", required: true },
            { name: "nameRu", label: "На Русском", required: true },
            { name: "nameKz", label: "На Казахском", required: true },
            { name: "nameEn", label: "На Английском" }
        ]
    },
    [nodeTypeEnum.DIVISION]: {
        [layoutOptions.EDIT_DIVISION]: [
            { name: "code", label: "Код", required: true },
            { name: "nameRu", label: "На Русском", required: true },
            { name: "nameKz", label: "На Казахском", required: true },
            { name: "nameEn", label: "На Английском" }
        ],
        [layoutOptions.ADD_DIVISION]: [
            { name: "code", label: "Код", required: true },
            { name: "nameRu", label: "На Русском", required: true },
            { name: "nameKz", label: "На Казахском", required: true },
            { name: "nameEn", label: "На Английском" }
        ],
        [layoutOptions.ADD_DIVISION_UNIT]: [
            { name: "position", label: "Должность", required: true },
            { name: "priority", label: "Приоритет", required: true },
            { name: "isCompanyHead", label: "Руководитель", required: true }
        ]
    },
    [nodeTypeEnum.DIVISION_UNIT]: {
        [layoutOptions.EDIT_DIVISION_UNIT]: [
            { name: "position", label: "Должность", required: true },
            { name: "priority", label: "Приоритет", required: true },
            { name: "isCompanyHead", label: "Руководитель", required: true }
        ]
    }
};
