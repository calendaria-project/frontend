import type { FormRule } from "antd";
import { nodeTypeEnum } from "data/enums";

export interface ISimpleDictionaryModel {
    nameKz: string;
    nameRu: string;
    nameEn: string;
    id: number;
}

export interface ISimpleDictionaryViewModel extends ISimpleDictionaryModel {
    code: string;
}

export interface ICompanyTypeDictionaryViewModel {
    companyTypeId: number;
    code: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    longnameKz: string;
    longnameRu: string;
    longnameEn: string;
}

export interface ICompanyBaseModel {
    bin: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    parentId: number;
    companyType: ICompanyTypeDictionaryViewModel;
    companyIndex: string;
    fax: string;
    email: string;
    isCounterparty: boolean;
}

export interface IDivisionStatItemsSimpleViewModel {
    divisionId: number;
    nameRu: string;
    nameKz: string;
    nameEn: string;
    positionCnt: number;
    userCnt: number;
}

export interface ICompanyTreeNodeModel {
    bin: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    parentId: number;
    id: number;
    nodeType: string;
    companyId: number;
}

export interface ICompanyAddressBaseModel {
    address: string;
    type: string;
    country: ISimpleDictionaryViewModel;
    city: ISimpleDictionaryViewModel;
}

export interface ICompanyAddressCreateViewModel extends ICompanyAddressBaseModel {}

export interface ICompanyCreateViewModel extends ICompanyBaseModel {
    //post
    companyAddresses: ICompanyAddressCreateViewModel[];
}

export interface ICompanyAddressViewModel extends ICompanyAddressBaseModel {
    companyAddressId: number;
    companyId: number;
    country: ISimpleDictionaryViewModel;
    city: ISimpleDictionaryViewModel;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyViewModel extends ICompanyBaseModel {
    //put
    companyAddresses: ICompanyAddressViewModel[];
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyAddressDto {
    companyAddressId: number;
    address: string;
    type: string;
}

export interface IPositionBaseModel {
    code: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
}

export interface IPositionViewModel extends IPositionBaseModel {
    positionId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyTypeViewModel extends IPositionBaseModel {
    companyTypeId: number;
    longnameKz: string;
    longnameRu: string;
    longnameEn: string;
    createdAt: string;
    updatedAt: string;
}

export interface IFormItem {
    name: string;
    label: string;
    rules: FormRule[];
    tooltip?: string;
}

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

export interface IPositionViewModel extends IDictionaryBaseModel {
    positionId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IStaffingModel {
    staffingId: number;
    companyId: number; // ID компании
    fromDate: any; // Дата действия с
    toDate: any; // Дата действия по
    createdAt: string;
    updatedAt: string;
}

export interface IStaffingItemModel {
    staffingItemId: number; // ID единицы штатного расписания (заполняется на бэке; в PUT нужно передать)
    staffingId: number; // ID штатного расписания
    divisionId: number; // ID подразделения
    positionId: number; // ID должности
    staffUnitCount: number; // Кол - во единиц
    salary: number; // Оклад
    salarySupplement: number; // Надбавка к окладу
    createdAt: string; // Дата создания(заполняется на бэке; в PUT нужно передать)
    updatedAt: string; // Дата обновления
}

export interface IStaffingItemCreateModel {
    staffingId: number;
    divisionId: number;
    positionId: number;
    staffUnitCount: number;
    salary: number;
    salarySupplement: number;
}

export interface IStaffingItemViewModel {
    staffingItemId: number;
    staffingId: number;
    divisionId: number;
    positionId: number;
    staffUnitCount: number;
    salary: number;
    salarySupplement: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDictionaryDtoModel {
    nameKz: string;
    nameRu: string;
    nameEn: string;
    id: number;
    description: string;
}

export interface ICompanyTypeModel {}

export interface ICompanyDtoModel {
    companyId: number;
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

export interface IDivisionDtoModel {
    divisionId: number;
    companyId: number;
    code: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    parentId: number;
}

export interface IPositionDtoModel {
    positionId: number;
    code: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
}

export interface IPersonalContactDtoModel {
    personalContactId: number;
    email: string;
    mobilePhoneNumber: string;
    homePhoneNumber: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IBusinessContactDtoModel {
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

export interface IUsersDtoViewModel {
    userId: string;
    username: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    iin: string;
    birthDate: string;
    sex: IDictionaryDtoModel;
    company: ICompanyDtoModel;
    division: IDivisionDtoModel;
    position: IPositionDtoModel;
    employmentDate: string;
    signFileId: string;
    profilePhotoId: string;
    personalContact: IPersonalContactDtoModel;
    businessContact: IBusinessContactDtoModel;
    createdAt: string;
    updatedAt: string;
}

export interface ICurrentUserDtoViewModel extends IUsersDtoViewModel {
    divisionId: number;
    enabled: boolean;
}

export interface IUsersTableModel {
    id: string | number;
    fullName: string;
    email?: string;
    status: string;
    profession: string;
    phone?: string;
    date: any;
}

export interface IExternalUsersDtoViewModel {
    userId: string;
    username: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    company: ICompanyDtoModel;
    counterparty: ICompanyDtoModel;
    position: IPositionDtoModel;
    personalContact: IPersonalContactDtoModel;
    enabled: boolean;
    profilePhotoId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IExternalUsersDataModel extends IExternalUsersDtoViewModel {
    fullName?: string;
    currentPhotoId?: string;
}

export interface IUsersCardModel {
    id: string | number;
    fullName: string;
    email?: string;
    iin: string;
    birth: any;
    date: any;
    gender: string;
    profession: string;
    phone?: string;
    sign: any;
}

export interface IUsersDocumentModel {
    id: string | number;
    documentType: ISimpleDictionaryModel;
    documentNum: string;
    issueDate: string;
    issueAuthority: ISimpleDictionaryModel;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersContractModel {
    contractId: string | number;
    contractType: ISimpleDictionaryModel;
    contractNum: string;
    contractDate: string;
    contractEndDate: string;
    workType: ISimpleDictionaryModel;
    workKind: ISimpleDictionaryModel;
    salaryConstantPart: number;
    salaryVariablePart: number;
    salary: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersInventoryModel {
    inventoryId: string | number;
    inventoryType: ISimpleDictionaryModel;
    num: string;
    serialNum: string;
    modelNum: string;
    note: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersEducationModel {
    educationId: string | number;
    institution: ISimpleDictionaryModel;
    educationLevel: ISimpleDictionaryModel;
    specialty: ISimpleDictionaryModel;
    endYear: string | number;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersLanguageKnowledgeModel {
    languageKnowledgeId: string | number;
    language: ISimpleDictionaryModel;
    knowledgeLevel: ISimpleDictionaryModel;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersAddressInfoModel {
    addressInfoId: string | number;
    addressType: ISimpleDictionaryModel;
    city: ISimpleDictionaryModel;
    street: string;
    houseNum: string;
    flatNum: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUsersRelationshipModel {
    familyRelationshipId: string | number;
    sex: ISimpleDictionaryModel;
    relationshipType: ISimpleDictionaryModel;
    birthDate: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface IOrgStructureTreeItem {
    code: string;
    id: number;
    nameEn: string;
    nameRu: string;
    nodeType: nodeTypeEnum.DIVISION | nodeTypeEnum.DIVISION_UNIT | nodeTypeEnum.COMPANY;
    parentId?: number;
    children: Array<IOrgStructureTreeItem> | [];
}

export interface IDivisionUnitDtoModel {
    unitId: number;
    company: ICompanyDtoModel;
}

export interface IExtendedOrgStructureTreeItem extends IOrgStructureTreeItem {
    title: string;
    key: string;
    icon: JSX.Element;
}

export interface IBirthDateStatItem {
    userId: string;
    lastname: string;
    firstname: string;
    patronymic: string;
    birthDate: string;
    profilePhotoId: string;
}

export interface IAllStatisticsModel {
    allUsersCnt: number;
    createdUsersCnt: number;
    createdUsersPercent: number;
    disabledUsersCnt: number;
    disabledUsersPercent: number;
    birthDateStatItems: IBirthDateStatItem[];
    externalUsers: IExternalUsersDtoViewModel[];
    divisionStatItems: IDivisionStatItemsSimpleViewModel[];
    temporaryWorkersCnt: number;
    pieceWorkersCnt: number;
}
