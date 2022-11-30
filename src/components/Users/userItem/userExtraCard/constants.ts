import { dictionaryCodesEnum } from "data/enums";
import { phonePattern, mailPattern, phoneMessage, mailMessage } from "utils/patterns";

export enum Types {
    TITLE = "title",
    UNEDITABLE = "uneditable",
    SELECT = "select",
    INPUT = "input",
    TEXTAREA = "textArea",
    DATE = "date"
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
    SHARED_INFO = "sharedInfo",
    ADDITIONAL_INFO = "additionalInfo",
    EDUCATION = "education",
    LANGUAGE_KNOWLEDGE = "languageKnowledge",
    RELATIONSHIP = "relationship",
    MILITARY_INFO = "militaryInfo"
}

export const arrayKeyTypes: Array<string> = [
    SelectedKeyTypes.EDUCATION,
    SelectedKeyTypes.LANGUAGE_KNOWLEDGE,
    SelectedKeyTypes.CONTRACT,
    SelectedKeyTypes.INVENTORY,
    SelectedKeyTypes.DOCUMENT,
    SelectedKeyTypes.ADDRESS_INFO,
    SelectedKeyTypes.RELATIONSHIP
];

export const additionalMenuTypes: Array<string> = [
    SelectedKeyTypes.SHARED_INFO,
    SelectedKeyTypes.ADDITIONAL_INFO,
    SelectedKeyTypes.LANGUAGE_KNOWLEDGE,
    SelectedKeyTypes.EDUCATION,
    SelectedKeyTypes.RELATIONSHIP,
    SelectedKeyTypes.MILITARY_INFO
];

export type TInputData = {
    type: string;
    propertyName: string;
    dictionaryCode?: string;
    inputType?: string;
    customType?: "mobile";
    withSearch?: boolean;
    pattern?: RegExp;
    patternMessage?: string;
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
            customType: "mobile",
            pattern: phonePattern,
            patternMessage: phoneMessage,
            placeholder: "Мобильный номер",
            required: true
        },
        {
            type: Types.INPUT,
            patternMessage: mailMessage,
            pattern: mailPattern,
            propertyName: "email",
            placeholder: "Личный e-mail"
        },
        {
            type: Types.INPUT,
            propertyName: "homePhoneNumber",
            customType: "mobile",
            patternMessage: phoneMessage,
            pattern: phonePattern,
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
            customType: "mobile",
            patternMessage: phoneMessage,
            pattern: phonePattern,
            placeholder: "Номер мобильного телефона",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "internalPhoneNumber",
            customType: "mobile",
            patternMessage: phoneMessage,
            pattern: phonePattern,
            placeholder: "Номер рабочего телефона"
        },
        {
            type: Types.INPUT,
            patternMessage: phoneMessage,
            pattern: mailPattern,
            propertyName: "email",
            placeholder: "Корпоративный e-mail"
        }
    ],
    [SelectedKeyTypes.INVENTORY]: [
        {
            type: Types.SELECT,
            dictionaryCode: dictionaryCodesEnum.INVENTORY_TYPE,
            propertyName: "inventoryType",
            placeholder: "Тип инвентаря",
            withSearch: true,
            required: true
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
            dictionaryCode: dictionaryCodesEnum.DOCUMENT_TYPE,
            placeholder: "Тип документа",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "documentNum",
            placeholder: "Номер документа",
            required: true
        },
        {
            type: Types.SELECT,
            propertyName: "issueAuthority",
            dictionaryCode: dictionaryCodesEnum.ISSUE_AUTHORITY,
            placeholder: "Орган выдачи"
        },
        {
            type: Types.DATE,
            propertyName: "issueDate",
            placeholder: "Дата выдачи",
            required: true
        }
    ],
    [SelectedKeyTypes.ADDRESS_INFO]: [
        {
            type: Types.SELECT,
            propertyName: "addressType",
            dictionaryCode: dictionaryCodesEnum.ADDRESS_TYPE,
            placeholder: "Тип адреса",
            required: true
        },
        {
            type: Types.SELECT,
            propertyName: "city",
            dictionaryCode: dictionaryCodesEnum.CITY,
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
            dictionaryCode: dictionaryCodesEnum.CAR_MODEL,
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
            type: Types.SELECT,
            propertyName: "contractType",
            dictionaryCode: dictionaryCodesEnum.CONTRACT_TYPE,
            placeholder: "Тип договора",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "contractNum",
            placeholder: "Номер договора",
            required: true
        },
        {
            type: Types.DATE,
            propertyName: "contractDate",
            placeholder: "Дата начала договора",
            required: true
        },
        {
            type: Types.SELECT,
            propertyName: "workType",
            dictionaryCode: dictionaryCodesEnum.WORK_TYPE,
            placeholder: "Тип работ",
            required: true
        },
        {
            type: Types.SELECT,
            propertyName: "workKind",
            dictionaryCode: dictionaryCodesEnum.WORK_KIND,
            placeholder: "Вид работ",
            required: true
        },
        {
            type: Types.DATE,
            propertyName: "contractEndDate",
            placeholder: "Дата окончания договора"
        },
        {
            type: Types.TITLE,
            placeholder: "Заработная плата",
            propertyName: ""
        },
        {
            type: Types.INPUT,
            propertyName: "salaryConstantPart",
            inputType: "number",
            placeholder: "Постоянная часть з/п",
            required: true
        },
        {
            type: Types.INPUT,
            propertyName: "salaryVariablePart",
            inputType: "number",
            placeholder: "Переменная часть з/п",
            required: true
        }
    ],

    [SelectedKeyTypes.ADDITIONAL_INFO]: [
        { type: Types.TEXTAREA, propertyName: "aboutMe", placeholder: "О себе", required: true },
        { type: Types.TEXTAREA, propertyName: "description", placeholder: "Примечание" }
    ],
    [SelectedKeyTypes.EDUCATION]: [
        {
            type: Types.SELECT,
            propertyName: "institution",
            dictionaryCode: dictionaryCodesEnum.EDUCATION_INSTITUTION,
            placeholder: "Учебное заведение",
            withSearch: true,
            required: true
        },
        //GET - array, POST - object
        {
            type: Types.SELECT,
            propertyName: "educationLevel",
            dictionaryCode: dictionaryCodesEnum.EDUCATION_LEVEL,
            placeholder: "Уровень образования",
            withSearch: true,
            required: true
        },
        //GET - array, POST - object
        {
            type: Types.SELECT,
            propertyName: "specialty",
            dictionaryCode: dictionaryCodesEnum.SPECIALTY,
            placeholder: "Специальность",
            required: true
        }
    ],
    [SelectedKeyTypes.LANGUAGE_KNOWLEDGE]: [
        {
            type: Types.SELECT,
            propertyName: "language",
            dictionaryCode: dictionaryCodesEnum.LANGUAGE,
            placeholder: "Язык",
            withSearch: true,
            required: true
        },
        {
            type: Types.SELECT,
            propertyName: "knowledgeLevel",
            dictionaryCode: dictionaryCodesEnum.LANGUAGE_KNOWLEDGE_LEVEL,
            placeholder: "Уровень владения",
            required: true
        }
    ],
    [SelectedKeyTypes.RELATIONSHIP]: [
        {
            type: Types.SELECT,
            propertyName: "sex",
            dictionaryCode: dictionaryCodesEnum.SEX,
            placeholder: "Пол",
            required: true
        },
        {
            type: Types.SELECT,
            propertyName: "relationshipType",
            dictionaryCode: dictionaryCodesEnum.RELATIONSHIP_TYPE,
            placeholder: "Родство",
            required: true
        },
        {
            type: Types.DATE,
            propertyName: "birthDate",
            placeholder: "Дата рождения",
            required: true
        },
        { type: Types.INPUT, propertyName: "firstname", placeholder: "Имя", required: true },
        { type: Types.INPUT, propertyName: "lastname", placeholder: "Фамилия", required: true },
        { type: Types.INPUT, propertyName: "patronymic", placeholder: "Отчество" }
    ],
    [SelectedKeyTypes.MILITARY_INFO]: [
        {
            type: Types.SELECT,
            propertyName: "militaryRank",
            dictionaryCode: dictionaryCodesEnum.MILITARY_RANK,
            placeholder: "Военное звание",
            required: true
        },
        {
            type: Types.DATE,
            propertyName: "enlistmentDate",
            placeholder: "Дата приема на службу",
            required: true
        }
    ]
};

export const REDUCED_CONTRACT_INFO: TInputData[] = [
    {
        type: Types.SELECT,
        propertyName: "contractType",
        dictionaryCode: dictionaryCodesEnum.CONTRACT_TYPE,
        placeholder: "Тип договора",
        required: true
    },
    {
        type: Types.INPUT,
        propertyName: "contractNum",
        placeholder: "Номер договора",
        required: true
    },
    {
        type: Types.DATE,
        propertyName: "contractDate",
        placeholder: "Дата начала договора",
        required: true
    }
];
