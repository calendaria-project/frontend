import {
    editingOptions,
    layoutOptions,
    TLayoutOptions
} from "components/OrganizationStructure/contants";
import { nodeTypeEnum } from "data/enums";

const getOrgStructureModalTitle = (
    nodeType: string | undefined,
    layoutOption: TLayoutOptions | undefined
) => {
    if (!nodeType || !layoutOption) {
        return "";
    }

    if (layoutOption === layoutOptions.DELETE_DIVISION) {
        return "Вы действительно хотите удалить текущее подразделение?";
    }

    if (layoutOption === layoutOptions.DELETE_DIVISION_UNIT) {
        return "Вы действительно хотите удалить текущую должность?";
    }

    let title = "";
    if (editingOptions.includes(layoutOption)) {
        title += "Редактировать";
    } else {
        title += "Добавить";
    }
    if (nodeType === nodeTypeEnum.COMPANY) {
        if (editingOptions.includes(layoutOption)) {
            title += " компанию";
        } else {
            title += " подразделение";
        }
    } else if (nodeType === nodeTypeEnum.DIVISION) {
        title += " подразделение";
    } else if (nodeType === nodeTypeEnum.DIVISION_UNIT) {
        title += " должность";
    }
    return title;
};
export default getOrgStructureModalTitle;
