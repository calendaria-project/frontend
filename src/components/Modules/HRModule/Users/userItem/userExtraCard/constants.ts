import { dictionaryCodesEnum } from "data/enums";
import { phonePattern, mailPattern, phoneMessage, mailMessage } from "data/patterns";
import { selectedKeyTypes } from "data/enums";
import { TLayoutModalDataRecord } from "data/types";
import { layoutConstantTypes } from "data/enums";

export const arrayKeyTypes: Array<string> = [
    selectedKeyTypes.EDUCATION,
    selectedKeyTypes.LANGUAGE_KNOWLEDGE,
    selectedKeyTypes.CONTRACT,
    selectedKeyTypes.INVENTORY,
    selectedKeyTypes.DOCUMENT,
    selectedKeyTypes.ADDRESS_INFO,
    selectedKeyTypes.RELATIONSHIP
];

export const additionalMenuTypes: Array<string> = [
    selectedKeyTypes.SHARED_INFO,
    selectedKeyTypes.ADDITIONAL_INFO,
    selectedKeyTypes.LANGUAGE_KNOWLEDGE,
    selectedKeyTypes.EDUCATION,
    selectedKeyTypes.RELATIONSHIP,
    selectedKeyTypes.MILITARY_INFO
];

export const modalData: TLayoutModalDataRecord = {
    [selectedKeyTypes.USER]: [
        { type: layoutConstantTypes.UNEDITABLE, propertyName: "username", placeholder: "Логин" }
    ],
    [selectedKeyTypes.CONTACT_PERSONAL]: [
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "mobilePhoneNumber",
            customType: "mobile",
            pattern: phonePattern,
            patternMessage: phoneMessage,
            placeholder: "Мобильный номер",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            patternMessage: mailMessage,
            pattern: mailPattern,
            propertyName: "email",
            placeholder: "Личный e-mail"
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "homePhoneNumber",
            customType: "mobile",
            patternMessage: phoneMessage,
            pattern: phonePattern,
            placeholder: "Домашний телефон"
        }
    ],
    [selectedKeyTypes.CONTACT_BUSINESS]: [
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "workPlace",
            placeholder: "Адрес места работы"
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "cabinetNumber",
            placeholder: "Номер кабинета"
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "mobilePhoneNumber",
            customType: "mobile",
            patternMessage: phoneMessage,
            pattern: phonePattern,
            placeholder: "Номер мобильного телефона",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "internalPhoneNumber",
            customType: "mobile",
            patternMessage: phoneMessage,
            pattern: phonePattern,
            placeholder: "Номер рабочего телефона"
        },
        {
            type: layoutConstantTypes.INPUT,
            patternMessage: phoneMessage,
            pattern: mailPattern,
            propertyName: "email",
            placeholder: "Корпоративный e-mail"
        }
    ],
    [selectedKeyTypes.INVENTORY]: [
        {
            type: layoutConstantTypes.SELECT,
            dictionaryCode: dictionaryCodesEnum.INVENTORY_TYPE,
            propertyName: "inventoryType",
            placeholder: "Тип инвентаря",
            withSearch: true,
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "num",
            placeholder: "Инвентарный номер",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "serialNum",
            placeholder: "Инвентарный серийный номер"
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "modelNum",
            placeholder: "Инвентарный номер модель"
        },
        { type: layoutConstantTypes.INPUT, propertyName: "note", placeholder: "Комментарий" }
    ],
    [selectedKeyTypes.DOCUMENT]: [
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "documentType",
            dictionaryCode: dictionaryCodesEnum.DOCUMENT_TYPE,
            placeholder: "Тип документа",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "documentNum",
            placeholder: "Номер документа",
            required: true
        },
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "issueAuthority",
            dictionaryCode: dictionaryCodesEnum.ISSUE_AUTHORITY,
            placeholder: "Орган выдачи"
        },
        {
            type: layoutConstantTypes.DATE,
            propertyName: "issueDate",
            placeholder: "Дата выдачи",
            required: true
        }
    ],
    [selectedKeyTypes.ADDRESS_INFO]: [
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "addressType",
            dictionaryCode: dictionaryCodesEnum.ADDRESS_TYPE,
            placeholder: "Тип адреса",
            required: true
        },
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "city",
            dictionaryCode: dictionaryCodesEnum.CITY,
            placeholder: "Город",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "street",
            placeholder: "Улица",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "houseNum",
            placeholder: "Дом",
            required: true
        },
        { type: layoutConstantTypes.INPUT, propertyName: "flatNum", placeholder: "Квартира" }
    ],
    [selectedKeyTypes.CAR_INFO]: [
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "carModel",
            dictionaryCode: dictionaryCodesEnum.CAR_MODEL,
            placeholder: "Марка",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "carNum",
            placeholder: "Государственный номер",
            required: true
        },
        { type: layoutConstantTypes.INPUT, propertyName: "note", placeholder: "Примечание" }
    ],
    [selectedKeyTypes.CONTRACT]: [
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
        },
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "workType",
            dictionaryCode: dictionaryCodesEnum.WORK_TYPE,
            placeholder: "Тип работ",
            required: true
        },
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "workKind",
            dictionaryCode: dictionaryCodesEnum.WORK_KIND,
            placeholder: "Вид работ",
            required: true
        },
        {
            type: layoutConstantTypes.DATE,
            propertyName: "contractEndDate",
            placeholder: "Дата окончания договора"
        },
        {
            type: layoutConstantTypes.TITLE,
            placeholder: "Заработная плата",
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
    ],

    [selectedKeyTypes.ADDITIONAL_INFO]: [
        {
            type: layoutConstantTypes.TEXTAREA,
            propertyName: "aboutMe",
            placeholder: "О себе",
            required: true
        },
        {
            type: layoutConstantTypes.TEXTAREA,
            propertyName: "description",
            placeholder: "Примечание"
        }
    ],
    [selectedKeyTypes.EDUCATION]: [
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "institution",
            dictionaryCode: dictionaryCodesEnum.EDUCATION_INSTITUTION,
            placeholder: "Учебное заведение",
            withSearch: true,
            required: true
        },
        //GET - array, POST - object
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "educationLevel",
            dictionaryCode: dictionaryCodesEnum.EDUCATION_LEVEL,
            placeholder: "Уровень образования",
            withSearch: true,
            required: true
        },
        //GET - array, POST - object
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "specialty",
            dictionaryCode: dictionaryCodesEnum.SPECIALTY,
            placeholder: "Специальность",
            required: true
        }
    ],
    [selectedKeyTypes.LANGUAGE_KNOWLEDGE]: [
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "language",
            dictionaryCode: dictionaryCodesEnum.LANGUAGE,
            placeholder: "Язык",
            withSearch: true,
            required: true
        },
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "knowledgeLevel",
            dictionaryCode: dictionaryCodesEnum.LANGUAGE_KNOWLEDGE_LEVEL,
            placeholder: "Уровень владения",
            required: true
        }
    ],
    [selectedKeyTypes.RELATIONSHIP]: [
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "sex",
            dictionaryCode: dictionaryCodesEnum.SEX,
            placeholder: "Пол",
            required: true
        },
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "relationshipType",
            dictionaryCode: dictionaryCodesEnum.RELATIONSHIP_TYPE,
            placeholder: "Родство",
            required: true
        },
        {
            type: layoutConstantTypes.DATE,
            propertyName: "birthDate",
            placeholder: "Дата рождения",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "firstname",
            placeholder: "Имя",
            required: true
        },
        {
            type: layoutConstantTypes.INPUT,
            propertyName: "lastname",
            placeholder: "Фамилия",
            required: true
        },
        { type: layoutConstantTypes.INPUT, propertyName: "patronymic", placeholder: "Отчество" }
    ],
    [selectedKeyTypes.MILITARY_INFO]: [
        {
            type: layoutConstantTypes.SELECT,
            propertyName: "militaryRank",
            dictionaryCode: dictionaryCodesEnum.MILITARY_RANK,
            placeholder: "Военное звание",
            required: true
        },
        {
            type: layoutConstantTypes.DATE,
            propertyName: "enlistmentDate",
            placeholder: "Дата приема на службу",
            required: true
        }
    ]
};
