export enum Types {
    UNEDITABLE = "uneditable",
    SELECT = "select",
    INPUT = "input"
}

export enum SelectedKeyTypes {
    USER = "user",
    CONTACT_PERSONAL = "contact_personal",
    CONTACT_BUSINESS = "contact_business",
    INVENTORY = "inventory",
    DOCUMENT = "document",
    ADDRESS_INFO = "addressInfo",
    CAR_INFO = "carInfo",
    CONTRACT = "contract",
    ADDITIONAL_INFO = "additionalInfo",
    EDUCATION = "education",
    LANGUAGE_KNOWLEDGE = "languageKnowledge"
}

export type TInputData = {
    type: string;
    propertyName: string;
    dictionaryCode?: string;
    inputType?: string;
    placeholder: string;
    required?: boolean;
};

type InputDataRecord = {
    [key: string]: Array<TInputData>;
};

export const inputData: InputDataRecord = {
    [SelectedKeyTypes.USER]: [
        { type: Types.UNEDITABLE, propertyName: "username", placeholder: "Логин" }
    ],
    [SelectedKeyTypes.CONTACT_PERSONAL]: [
        {
            type: Types.INPUT,
            propertyName: "mobilePhoneNumber",
            placeholder: "Мобильный номер",
            required: true
        },
        {
            type: Types.INPUT,
            inputType: "email",
            propertyName: "email",
            placeholder: "Личный e-mail"
        },
        {
            type: Types.INPUT,
            propertyName: "homePhoneNumber",
            placeholder: "Домашний телефон"
        }
    ],
    [SelectedKeyTypes.CONTACT_BUSINESS]: [
        { type: Types.INPUT, propertyName: "workPlace", placeholder: "Адрес места работы" },
        {
            type: Types.INPUT,
            propertyName: "cabinetNumber",
            placeholder: "Номер кабинета"
        },
        {
            type: Types.INPUT,
            propertyName: "mobilePhoneNumber",
            placeholder: "Внутренний номер"
        },
        {
            type: Types.INPUT,
            propertyName: "internalPhoneNumber",
            placeholder: "Корпоративный мобильный номер"
        },
        {
            type: Types.INPUT,
            inputType: "email",
            propertyName: "email",
            placeholder: "Корпоративный e-mail"
        }
    ],
    [SelectedKeyTypes.INVENTORY]: [
        {
            type: Types.SELECT,
            dictionaryCode: "INVENTORY_TYPE",
            propertyName: "inventoryType",
            placeholder: "Тип инвентаря"
        },
        {
            type: Types.INPUT,
            propertyName: "num",
            placeholder: "Инвентарный номер",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "serialNum",
            placeholder: "Инвентарный серийный номер"
        },
        {
            type: Types.INPUT,
            propertyName: "modelNum",
            placeholder: "Инвентарный номер модель"
        },
        { type: Types.INPUT, propertyName: "note", placeholder: "Комментарий" }
    ],
    [SelectedKeyTypes.DOCUMENT]: [
        {
            type: Types.SELECT,
            propertyName: "documentType",
            dictionaryCode: "DOCUMENT_TYPE",
            placeholder: "Тип документа"
        },
        {
            type: Types.INPUT,
            propertyName: "documentNum",
            placeholder: "Номер документа",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "issueAuthority",
            placeholder: "Орган выдачи",
            required: true
        }
    ],
    [SelectedKeyTypes.ADDRESS_INFO]: [
        {
            type: Types.SELECT,
            propertyName: "city",
            dictionaryCode: "CITY",
            placeholder: "Город",
            required: true
        },
        { type: Types.INPUT, propertyName: "street", placeholder: "Улица", required: true },
        { type: Types.INPUT, propertyName: "houseNum", placeholder: "Дом", required: true },
        { type: Types.INPUT, propertyName: "flatNum", placeholder: "Квартира" }
    ],
    [SelectedKeyTypes.CAR_INFO]: [
        {
            type: Types.SELECT,
            propertyName: "carModel",
            dictionaryCode: "CAR_MODEL",
            placeholder: "Марка",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "carNum",
            placeholder: "Государственный номер",
            required: true
        },
        { type: Types.INPUT, propertyName: "note", placeholder: "Примечание" }
    ],
    [SelectedKeyTypes.CONTRACT]: [
        {
            type: Types.INPUT,
            propertyName: "contractNum",
            placeholder: "Номер договора",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "contractDate",
            placeholder: "Дата договора",
            required: true
        }
    ],

    [SelectedKeyTypes.ADDITIONAL_INFO]: [
        { type: Types.INPUT, propertyName: "description", placeholder: "Примечание" },
        { type: Types.INPUT, propertyName: "aboutMe", placeholder: "О себе" }
    ],
    [SelectedKeyTypes.EDUCATION]: [
        {
            type: Types.SELECT,
            propertyName: "institution",
            dictionaryCode: "EDUCATION_INSTITUTION",
            placeholder: "Учебное заведение"
        },
        //GET - array, POST - object
        {
            type: Types.SELECT,
            propertyName: "educationLevel",
            dictionaryCode: "EDUCATION_LEVEL",
            placeholder: "Уровень образования"
        },
        //GET - array, POST - object
        {
            type: Types.SELECT,
            propertyName: "specialty",
            dictionaryCode: "SPECIALTY",
            placeholder: "Специальность"
        }
    ],
    [SelectedKeyTypes.LANGUAGE_KNOWLEDGE]: [
        {
            type: Types.SELECT,
            propertyName: "language",
            dictionaryCode: "LANGUAGE",
            placeholder: "Язык"
        },
        {
            type: Types.SELECT,
            propertyName: "knowledgeLevel",
            dictionaryCode: "LANGUAGE_KNOWLEDGE_LEVEL",
            placeholder: "Уровень владения"
        }
    ]
};
