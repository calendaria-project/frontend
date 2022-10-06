import type { FormRule } from "antd";

export interface ICompanyBaseModel {
    bin: string;
    nameKz: string;
    nameRu: string;
    nameEn: string;
    parentId: number;
}

export interface ICompanyTreeNodeModel extends ICompanyBaseModel {
    id: number;
    nodeType: string;
    companyId: number;
}

export interface ICompanyAddressBaseModel {
    address: string;
    type: string;
}

export interface ICompanyCreateViewModel extends ICompanyBaseModel {
    companyAddresses: ICompanyAddressCreateViewModel[];
}

export interface ICompanyViewModel extends ICompanyBaseModel {
    companyAddresses: ICompanyAddressViewModel[];
    companyId: number;
    createdAt: string;
    updatedAt: string;
}

export interface ICompanyAddressCreateViewModel extends ICompanyAddressBaseModel {}

export interface ICompanyAddressViewModel extends ICompanyAddressBaseModel {
    companyAddressId: number;
    companyId: number;
    createdAt: string;
    updatedAt: string;
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
