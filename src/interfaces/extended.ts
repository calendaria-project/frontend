import {
    IBirthDateStatItemViewModel,
    IDictionaryBaseModel,
    IExternalUsersViewModel,
    IOrgStructureTreeItemViewModel,
    IUsersByStaffingViewModel,
    IUsersViewModel
} from "interfaces";

//dictionary base

export interface IAppItemAccessOptionalTypeViewModel extends IDictionaryBaseModel {
    appItemTypeId?: number;
}

//org structure
export interface IExtendedOrgStructureTreeItem extends IOrgStructureTreeItemViewModel {
    title: JSX.Element;
    key: string;
    icon: JSX.Element;
}

//Users
export interface IUsersWithPhotoModel extends IUsersViewModel {
    currentPhotoId: string;
}

export interface IUsersWithPhotoInfoModel extends IUsersWithPhotoModel {
    fullName?: string;
}

//UsersByStaffing
export interface IUsersByStaffingDtoViewModel extends IUsersByStaffingViewModel {
    fullName?: string;
    currentPhotoId?: string;
}

//ExternalUsers
export interface IExternalUsersDataModel extends IExternalUsersViewModel {
    fullName?: string;
    currentPhotoId?: string;
}

//stat items
export interface IBirthStatItemWithPhotoModel extends IBirthDateStatItemViewModel {
    currentPhotoId: string;
}
