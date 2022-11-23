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
    WORK_KIND = "WORK_KIND"
}

export enum mainMenuEnum {
    mainMenu = "mainMenu",
    dictionary = "dictionary",
    staffing = "staffing",
    users = "users",
    userItem = "userItem",
    organizationStructure = "organizationStructure",
    externalUsers = "externalUsers"
}

export enum nodeTypeEnum {
    COMPANY = "COMPANY",
    DIVISION = "DIVISION",
    DIVISION_UNIT = "DIVISION_UNIT"
}

export type TNodeTypeEnum =
    | nodeTypeEnum.DIVISION
    | nodeTypeEnum.DIVISION_UNIT
    | nodeTypeEnum.COMPANY;
