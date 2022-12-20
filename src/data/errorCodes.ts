export interface IErrorDetail {
    entity: string;
    field: string;
    entityId: number | string;
    errorCode: string;
}

export interface IErrorModifiedItem {
    selectedKey: string;
    id: string | number;
    field: string;
    addText: string;
}

export enum errors {
    IDENTITY_DOCUMENT_NOT_FOUND = "IDENTITY_DOCUMENT_NOT_FOUND",
    COMPANY_JUR_ADDRESS_NOT_FOUND = "COMPANY_JUR_ADDRESS_NOT_FOUND",
    COMPANY_JUR_ADDRESS_CITY_NOT_FOUND = "COMPANY_JUR_ADDRESS_CITY_NOT_FOUND",
    COMPANY_JUR_ADDRESS_COUNTRY_NOT_FOUND = "COMPANY_JUR_ADDRESS_COUNTRY_NOT_FOUND",
    COMPANY_JUR_ADDRESS_ADDRESS_NOT_FOUND = "COMPANY_JUR_ADDRESS_ADDRESS_NOT_FOUND",
    USER_ADDRESS_INFO_NOT_FOUND = "USER_ADDRESS_INFO_NOT_FOUND",
    DIVISION_UNITS_NOT_FOUND = "DIVISION_UNITS_NOT_FOUND",
    HEAD_DIVISION_UNIT_NOT_FOUND = "HEAD_DIVISION_UNIT_NOT_FOUND",
    HEAD_DIVISION_UNIT_NOT_FILLED = "HEAD_DIVISION_UNIT_NOT_FILLED",
    DOCUMENT_NUM_NOT_FILLED = "DOCUMENT_NUM_NOT_FILLED",
    DOCUMENT_ISSUE_AUTH_NOT_FILLED = "DOCUMENT_ISSUE_AUTH_NOT_FILLED",
    DOCUMENT_ISSUE_DATE_NOT_FILLED = "DOCUMENT_ISSUE_DATE_NOT_FILLED",
    COMPANY_TYPE_NOT_FILLED = "COMPANY_TYPE_NOT_FILLED",
    COMPANY_INDEX_NOT_FILLED = "COMPANY_INDEX_NOT_FILLED",
    COMPANY_BIN_NOT_FILLED = "COMPANY_BIN_NOT_FILLED",
    COMPANY_NAME_RU_NOT_FILLED = "COMPANY_NAME_RU_NOT_FILLED",
    COMPANY_NAME_KZ_NOT_FILLED = "COMPANY_NAME_KZ_NOT_FILLED",
    COMPANY_EMAIL_NOT_FILLED = "COMPANY_EMAIL_NOT_FILLED",
    USER_LASTNAME_NOT_FILLED = "USER_LASTNAME_NOT_FILLED",
    USER_FIRSTNAME_NOT_FILLED = "USER_FIRSTNAME_NOT_FILLED",
    USER_IIN_NOT_FILLED = "USER_IIN_NOT_FILLED",
    USER_POSITION_NOT_FILLED = "USER_POSITION_NOT_FILLED"
}

export const modalErrorCodes: string[] = [
    errors.USER_ADDRESS_INFO_NOT_FOUND,
    errors.IDENTITY_DOCUMENT_NOT_FOUND,
    errors.DOCUMENT_NUM_NOT_FILLED,
    errors.DOCUMENT_ISSUE_AUTH_NOT_FILLED,
    errors.DOCUMENT_ISSUE_DATE_NOT_FILLED
];

export const errorCodes: { [key: string]: string } = {
    [errors.DIVISION_UNITS_NOT_FOUND]: "орг.структура компании",
    [errors.HEAD_DIVISION_UNIT_NOT_FOUND]: "руководитель в компании (заполните в орг.структуре)",
    [errors.HEAD_DIVISION_UNIT_NOT_FILLED]: "руководитель в компании (заполните в орг.структуре)",

    [errors.COMPANY_JUR_ADDRESS_NOT_FOUND]: "юр.адрес компании",
    [errors.COMPANY_JUR_ADDRESS_CITY_NOT_FOUND]: "город в Юр.адрес компании",
    [errors.COMPANY_JUR_ADDRESS_COUNTRY_NOT_FOUND]: "страна в Юр.адрес компании",
    [errors.COMPANY_JUR_ADDRESS_ADDRESS_NOT_FOUND]: "адрес в Юр.адрес компании",
    [errors.COMPANY_TYPE_NOT_FILLED]: "тип компании в компании",
    [errors.COMPANY_INDEX_NOT_FILLED]: "индекс компании",
    [errors.COMPANY_BIN_NOT_FILLED]: "БИН компании",
    [errors.COMPANY_NAME_RU_NOT_FILLED]: "наименование на рус. компании",
    [errors.COMPANY_NAME_KZ_NOT_FILLED]: "наименование на каз. компании",
    [errors.COMPANY_EMAIL_NOT_FILLED]: "Email компании",

    [errors.IDENTITY_DOCUMENT_NOT_FOUND]: "удостоверение личности",
    [errors.DOCUMENT_NUM_NOT_FILLED]: "номер документа в уд.личности",
    [errors.DOCUMENT_ISSUE_AUTH_NOT_FILLED]: "орган выдачи в уд.личности",
    [errors.DOCUMENT_ISSUE_DATE_NOT_FILLED]: "дата документа в уд.личности",

    [errors.USER_LASTNAME_NOT_FILLED]: "фамилия сотрудника",
    [errors.USER_FIRSTNAME_NOT_FILLED]: "имя сотрудника",
    [errors.USER_IIN_NOT_FILLED]: "ИИН сотрудника",
    [errors.USER_ADDRESS_INFO_NOT_FOUND]: "адрес сотрудника",
    [errors.USER_POSITION_NOT_FILLED]: "должность сотрудника"
};

enum simpleErrors {
    DUPLICATE_USER_IIN = "DUPLICATE_USER_IIN",
    USER_CONTRACT_TYPE_EXISTS = "USER_CONTRACT_TYPE_EXISTS",
    ENTITY_NOT_FOUND = "ENTITY_NOT_FOUND",
    NOT_NULL = "NOT_NULL",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
}

export type TSimpleErrors = simpleErrors;

export const simpleErrorsArr = [
    simpleErrors.DUPLICATE_USER_IIN,
    simpleErrors.USER_CONTRACT_TYPE_EXISTS,
    simpleErrors.ENTITY_NOT_FOUND,
    simpleErrors.NOT_NULL,
    simpleErrors.INTERNAL_SERVER_ERROR
];

export const simpleErrorCodes: { [key: string]: string } = {
    [simpleErrors.DUPLICATE_USER_IIN]: "Введенный ИИН существует в системе",
    [simpleErrors.USER_CONTRACT_TYPE_EXISTS]: "Трудовой договора уже существует у пользователя",
    [simpleErrors.ENTITY_NOT_FOUND]: "Объект не найден по указанным идентификаторам",
    [simpleErrors.NOT_NULL]: "Поле не может быть пустым или null",
    [simpleErrors.INTERNAL_SERVER_ERROR]: "серверная ошибка, обратитесь к администратору"
};
