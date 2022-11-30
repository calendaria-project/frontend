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

export const errorCodes = {
    [errors.DIVISION_UNITS_NOT_FOUND]: 'не заполнена "Орг.структура компании"',
    [errors.HEAD_DIVISION_UNIT_NOT_FOUND]:
        'не найден  "Руководитель в компании, заполните в орг.структуре"',
    [errors.HEAD_DIVISION_UNIT_NOT_FILLED]:
        'не найден  "Руководитель в компании, заполните в орг.структуре"',

    [errors.COMPANY_JUR_ADDRESS_NOT_FOUND]: 'не заполнен "Юр.адрес компании"',
    [errors.COMPANY_JUR_ADDRESS_CITY_NOT_FOUND]: 'не заполнен "Город в Юр.адрес компании"',
    [errors.COMPANY_JUR_ADDRESS_COUNTRY_NOT_FOUND]: 'не заполнена "Страна в Юр.адрес компании"',
    [errors.COMPANY_JUR_ADDRESS_ADDRESS_NOT_FOUND]: 'не заполнен "Адрес в Юр.адрес компании"',
    [errors.COMPANY_TYPE_NOT_FILLED]: 'не заполнен  "Тип компании в компании"',
    [errors.COMPANY_INDEX_NOT_FILLED]: 'не заполнен "Индекс компании"',
    [errors.COMPANY_BIN_NOT_FILLED]: 'не заполнен "БИН компании"',
    [errors.COMPANY_NAME_RU_NOT_FILLED]: 'не заполнено "Наименование на рус. компании"',
    [errors.COMPANY_NAME_KZ_NOT_FILLED]: 'не заполнено "Наименование на каз. компании"',
    [errors.COMPANY_EMAIL_NOT_FILLED]: 'не заполнен "Email компании"',

    [errors.IDENTITY_DOCUMENT_NOT_FOUND]: 'не найден документ "Удостоверение личности"',
    [errors.DOCUMENT_NUM_NOT_FILLED]: 'не заполнен  "Номер документа в уд.личности"',
    [errors.DOCUMENT_ISSUE_AUTH_NOT_FILLED]: 'не заполнен  "Орган выдачи в уд.личности"',
    [errors.DOCUMENT_ISSUE_DATE_NOT_FILLED]: 'не заполнена  "Дата документа в уд.личности"',

    [errors.USER_LASTNAME_NOT_FILLED]: 'не заполнена "Фамилия сотрудника"',
    [errors.USER_FIRSTNAME_NOT_FILLED]: 'не заполнено "Имя сотрудника"',
    [errors.USER_IIN_NOT_FILLED]: 'не заполнен "ИИН сотрудника"',
    [errors.USER_ADDRESS_INFO_NOT_FOUND]: 'не заполнен "Адрес сотрудника"',
    [errors.USER_POSITION_NOT_FILLED]: 'не заполнена "Должность сотрудника"'
};
