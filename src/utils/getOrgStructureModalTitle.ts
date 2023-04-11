import { layoutOptions, TLayoutOptions } from "modules/HRModule/OrganizationStructure/constants";

const getOrgStructureModalTitle = (layoutOption: TLayoutOptions | undefined) => {
    switch (layoutOption) {
        case layoutOptions.DELETE_DIVISION: {
            return "Вы действительно хотите удалить текущее подразделение?";
        }
        case layoutOptions.DELETE_DIVISION_UNIT: {
            return "Вы действительно хотите удалить текущую должность?";
        }
        case layoutOptions.ADD_DIVISION: {
            return "Добавить подразделение";
        }
        case layoutOptions.ADD_DIVISION_UNIT: {
            return "Добавить должность";
        }
        case layoutOptions.EDIT_COMPANY: {
            return "Редактировать компанию";
        }
        case layoutOptions.EDIT_DIVISION: {
            return "Редактировать подразделение";
        }
        case layoutOptions.EDIT_DIVISION_UNIT: {
            return "Редактировать должность";
        }
        default: {
            return "";
        }
    }
};
export default getOrgStructureModalTitle;
