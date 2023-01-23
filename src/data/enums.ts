export enum layoutConstantTypes {
    TITLE = "title",
    UNEDITABLE = "uneditable",
    CHECKBOX = "checkbox",
    SELECT = "select",
    POSITION_SELECT = "position_select",
    DIVISION_SELECT = "division_select",
    MULTIPLE_SELECT = "multipleSelect",
    INPUT = "input",
    TEXTAREA = "textArea",
    DATE = "date"
}

export enum selectedKeyTypes {
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

export enum StaffingNodeTypesEnum {
    COMPANY = "COMPANY",
    DIVISION = "DIVISION",
    STAFFING = "STAFFING",
    STAFFING_ITEM = "STAFFING_ITEM"
}

export enum dictionaryCodesEnum {
    ADDRESS_TYPE = "ADDRESS_TYPE",
    SEX = "SEX",
    CAR_MODEL = "CAR_MODEL",
    CITY = "CITY",
    CONTRACT_TYPE = "CONTRACT_TYPE",
    DOCUMENT_TYPE = "DOCUMENT_TYPE",
    ISSUE_AUTHORITY = "ISSUE_AUTHORITY",
    LANGUAGE = "LANGUAGE",
    LANGUAGE_KNOWLEDGE_LEVEL = "LANGUAGE_KNOWLEDGE_LEVEL",
    INVENTORY_TYPE = "INVENTORY_TYPE",
    EDUCATION_LEVEL = "EDUCATION_LEVEL",
    EDUCATION_INSTITUTION = "EDUCATION_INSTITUTION",
    SPECIALTY = "SPECIALTY",
    RELATIONSHIP_TYPE = "RELATIONSHIP_TYPE",
    MILITARY_RANK = "MILITARY_RANK",
    WORK_TYPE = "WORK_TYPE",
    WORK_KIND = "WORK_KIND",
    CONTRACT_FORM_TYPE = "CONTRACT_FORM_TYPE",
    CONTRACT_NORM_TYPE = "CONTRACT_NORM_TYPE",
    CONTRACT_NORM_CONDITION = "CONTRACT_NORM_CONDITION",
    TASK_ROLE = "TASK_ROLE",
    SELECTION_METHOD_TYPE = "SELECTION_METHOD_TYPE",
    ANALYSIS_METHOD_TYPE = "ANALYSIS_METHOD_TYPE",
    APP_ITEM_TYPE = "APP_ITEM_TYPE",
    MOBILE_TARIFF = "MOBILE_TARIFF"
}

export enum mainMenuEnum {
    mainMenu = "mainMenu",
    dictionary = "dictionary",
    staffing = "staffing",
    users = "users",
    userItem = "userItem",
    organizationStructure = "organizationStructure",
    externalUsers = "externalUsers",
    incoming = "incoming",
    outgoing = "outgoing",
    requests = "requests",
    information = "information"
}

export enum nodeTypeEnum {
    COMPANY = "COMPANY",
    DIVISION = "DIVISION",
    DIVISION_UNIT = "DIVISION_UNIT"
}

export enum appItemTypeValues {
    SKUD = "skud",
    MOBILE = "mobile",
    EMAIL = "email",
    BITRIX = "bitrix",
    ONE_C = "1c",
    TENDERIX = "tenderix",
    ADATA = "adata"
}

export enum appTypesEnum {
    GET_ACCESS = "GET_ACCESS",
    REMOVE_ACCESS = "REMOVE_ACCESS"
}

export enum accessRequestStatuses {
    ON_APPROVEMENT = "ON_APPROVEMENT",
    ON_PROCESS = "ON_PROCESS",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED",
    DONE = "DONE"
}

export enum accessItemRequestStatuses {
    ON_PROCESS = "ON_PROCESS",
    DONE = "DONE",
    CANCELED = "CANCELED"
}

export enum accessRequestHistoryStatuses {
    CREATED = "CREATED",
    REJECTED = "REJECTED",
    ON_APPROVEMENT = "ON_APPROVEMENT",
    APPROVED = "APPROVED",
    SYSTEM_ACCOUNTS_CREATED = "SYSTEM_ACCOUNTS_CREATED",
    ACCOUNT_TENDERIX_CREATED = "ACCOUNT_TENDERIX_CREATED",
    ACCOUNT_1C_CREATED = "ACCOUNT_1C_CREATED",
    ACCOUNT_ADATA_CREATED = "ACCOUNT_ADATA_CREATED",
    SKUD_CREATED = "SKUD_CREATED",
    ACCOUNT_BITRIX_CREATED = "ACCOUNT_BITRIX_CREATED",
    MOBILE_NUM_ISSUED = "MOBILE_NUM_ISSUED",
    FINISHED = "FINISHED",
    CANCELED = "CANCELED"
}
