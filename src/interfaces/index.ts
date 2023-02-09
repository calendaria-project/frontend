import { appTypesEnum, nodeTypeEnum } from "data/enums";
import { IExtendedAccessApplicationUserViewModel } from "./extended";

//simple dictionary
export interface ISimpleDictionaryBaseModel {
    nameKz: string;
    nameRu: string;
    nameEn: string;
    id: number;
}

export interface ISimpleDictionaryViewModel extends ISimpleDictionaryBaseModel {
    code: string;
}

//dictionary base
export interface IDictionaryBaseModel {
    nameKz: string;
    nameRu: string;
    nameEn: string;
    code: string;
}

export interface IDivisionViewModel extends IDictionaryBaseModel {
    divisionId: number;
    companyId: number;
    parentId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDivisionCreateViewModel extends IDictionaryBaseModel {
    companyId: number;
    parentId: number;
}

export interface IDivisionTreeNodeViewModel extends IDictionaryBaseModel {
    id: number;
    nodeType: string;
}

export interface IPositionModel extends IDictionaryBaseModel {
    positionId: number;
}

export interface IPositionViewModel extends IDictionaryBaseModel {
    positionId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDivisionViewModel extends IDictionaryBaseModel {
    divisionId: number;
    companyId: number;
    parentId: number;
}

export interface ICompanyTypeViewModel extends IDictionaryBaseModel {
    companyTypeId: number;
    longnameKz: string;
    longnameRu: string;
    longnameEn: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyTypeDictionaryViewModel extends IDictionaryBaseModel {
    companyTypeId: number;
    longnameKz: string;
    longnameRu: string;
    longnameEn: string;
}

export interface IAppItemAccessTypeViewModel extends IDictionaryBaseModel {
    appItemTypeId: number;
}

//dictionaries
export interface IDocumentViewModel {
    id: string | number;
    documentType: ISimpleDictionaryBaseModel;
    documentNum: string;
    issueDate: string;
    issueAuthority: ISimpleDictionaryBaseModel;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IRelationshipViewModel {
    familyRelationshipId: string | number;
    sex: ISimpleDictionaryBaseModel;
    relationshipType: ISimpleDictionaryBaseModel;
    birthDate: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IContractViewModel {
    contractId: string | number;
    contractType: ISimpleDictionaryBaseModel;
    contractNum: string;
    contractDate: string;
    contractEndDate: string;
    workType: ISimpleDictionaryBaseModel;
    workKind: ISimpleDictionaryBaseModel;
    salaryConstantPart: number;
    salaryVariablePart: number;
    salary: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IInventoryViewModel {
    inventoryId: string | number;
    inventoryType: ISimpleDictionaryBaseModel;
    num: string;
    serialNum: string;
    modelNum: string;
    note: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IEducationViewModel {
    educationId: string | number;
    institution: ISimpleDictionaryBaseModel;
    educationLevel: ISimpleDictionaryBaseModel;
    specialty: ISimpleDictionaryBaseModel;
    endYear: string | number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ILanguageKnowledgeViewModel {
    languageKnowledgeId: string | number;
    language: ISimpleDictionaryBaseModel;
    knowledgeLevel: ISimpleDictionaryBaseModel;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAddressInfoViewModel {
    addressInfoId: string | number;
    addressType: ISimpleDictionaryBaseModel;
    city: ISimpleDictionaryBaseModel;
    street: string;
    houseNum: string;
    flatNum: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

//Company
export interface ICompanyBaseModel {
    bin: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    isCounterparty: boolean;
    parentId: number;
    companyType: ICompanyTypeDictionaryViewModel;
    companyIndex: string;
    fax: string;
    email: string;
}

export interface ICompanyModel extends ICompanyBaseModel {
    companyId: number;
}

export interface ICompanyAddressBaseModel {
    address: string;
    type: string;
    country: ISimpleDictionaryViewModel;
    city: ISimpleDictionaryViewModel;
}

export interface ICompanyAddressViewModel extends ICompanyAddressBaseModel {
    companyAddressId: number;
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyViewModel extends ICompanyBaseModel {
    companyAddresses: ICompanyAddressViewModel[]; //put
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyCreateViewModel extends ICompanyBaseModel {
    companyAddresses: ICompanyAddressBaseModel[]; //post
}

export interface ICompanyTreeNodeModel {
    id: number;
    bin: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    parentId: number;
    nodeType: string;
    companyId: number;
}

//Users
export interface IPersonalContactViewModel {
    personalContactId: number;
    email: string;
    mobilePhoneNumber: string;
    homePhoneNumber: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IBusinessContactViewModel {
    businessContactId: number;
    email: string;
    mobilePhoneNumber: string;
    internalPhoneNumber: string;
    workPlace: string;
    cabinetNumber: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersViewModel {
    userId: string;
    username: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    iin: string;
    birthDate: string;
    sex: ISimpleDictionaryViewModel;
    company: ICompanyModel;
    division: IDivisionViewModel;
    divisionId: number;
    position: IPositionViewModel;
    employmentDate: string;
    signFileId: string;
    profilePhotoId: string;
    enabled: boolean;
    personalContact: IPersonalContactViewModel;
    businessContact: IBusinessContactViewModel;
    createdAt: string;
    updatedAt: string;
}

//UsersByStaffing
export interface IUsersByStaffingViewModel {
    userId: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    iin: string;
    division: IDivisionViewModel;
    position: IPositionViewModel;
    employmentDate: string;
    salaryConstantPercent: number;
    salaryConstantPart: number | string;
    salaryVariablePercent: number;
    salaryVariablePart: number | string;
    salary: number | string;
}

//External Users
export interface IExternalUsersViewModel {
    userId: string;
    username: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    company: ICompanyModel;
    counterparty: ICompanyModel;
    position: IPositionViewModel;
    personalContact: IPersonalContactViewModel;
    enabled: boolean;
    profilePhotoId: string;
    createdAt: string;
    updatedAt: string;
}

//org structure
export interface IOrgStructureTreeItemViewModel {
    code: string;
    id: number;
    nameRu: string;
    nameKz: string;
    nameEn: string;
    nodeType: nodeTypeEnum.DIVISION | nodeTypeEnum.DIVISION_UNIT | nodeTypeEnum.COMPANY;
    parentId?: number;
    isCompanyHead: boolean;
    isDivisionHead: boolean;
    children: IOrgStructureTreeItemViewModel[] | [];
}

//stats - main menu
export interface IBirthDateStatItemViewModel {
    userId: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    birthDate: string;
    profilePhotoId: string;
}

export interface IDivisionStatItemsSimpleViewModel {
    divisionId: number;
    nameRu: string;
    nameKz: string;
    nameEn: string;
    positionCnt: number;
    userCnt: number;
}

export interface IAllStatisticsViewModel {
    allUsersCnt: number;
    createdUsersCnt: number;
    createdUsersPercent: number;
    disabledUsersCnt: number;
    disabledUsersPercent: number;
    birthDateStatItems: IBirthDateStatItemViewModel[];
    externalUsers: IExternalUsersViewModel[];
    divisionStatItems: IDivisionStatItemsSimpleViewModel[];
    temporaryWorkersCnt: number;
    pieceWorkersCnt: number;
}

//access
export interface IAccessApplicationItemModel {
    appItemType: ISimpleDictionaryViewModel;
    needAccess: boolean;
    accessType?: IAppItemAccessTypeViewModel;
    tariff?: ISimpleDictionaryViewModel;
}

export interface IAccessApplicationStorageItemModel {
    accessStorageId: number;
    accessTypeId: number;
    appItemTypeId: number;
    hasAccess: boolean;
    tariffId?: number;
    userId: string;
}

export interface IAccessApplicationStorageItemViewModel extends IAccessApplicationStorageItemModel {
    createdAt: string;
    updatedAt: string;
}

export interface IAccessApplicationItemViewModel extends IAccessApplicationItemModel {
    applicationItemId: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAccessApplicationViewModel {
    appType: appTypesEnum.GET_ACCESS | appTypesEnum.REMOVE_ACCESS;
    comment: string;
    applicationUserId: string;
    items: IAccessApplicationItemModel[];
}

export interface IAccessApplicationUserViewModel {
    userId: string;
    username: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    iin: string;
    birthDate: string;
    sex: ISimpleDictionaryViewModel;
    company: ICompanyViewModel;
    division: IDivisionViewModel;
    divisionId: number;
    position: IPositionModel;
    employmentDate: string;
    profilePhotoId: string;
}

export interface IAccessAppDataByCurrentUserInKeyViewModel {
    accessRemoveReason: ISimpleDictionaryViewModel;
    accessRemoveType: ISimpleDictionaryViewModel;
    appType: appTypesEnum.GET_ACCESS | appTypesEnum.REMOVE_ACCESS;
    applicationId: number;
    companyId: number;
    divisionId: number;
    applicationEndDate: string; //при увольнении срок
    processingDeadline: string; //автоматический дедлайн на 24ч
    confirmationDocId: string;
    cancelReason: string;
    comment: string;
    status: string;
    applicationUser: IExtendedAccessApplicationUserViewModel;
    creatorUser: IAccessApplicationUserViewModel;
    creatorUserId: string;
    items: IAccessApplicationItemViewModel[];
    createdAt: string;
    updatedAt: string;
}

export type IAccessAppDataByCurrentUserViewModel = {
    [key: string]: IAccessAppDataByCurrentUserInKeyViewModel[];
};

export interface IAccessApplicationHistoryViewModel {
    historyId: number;
    comment: string;
    status: string;
    user: IAccessApplicationUserViewModel;
    createdAt: string;
    updatedAt: string;
}
