import { removeEmptyValuesFromAnyLevelObject } from "./removeObjectProperties";
import getObjectWithHandledDates from "./getObjectWithHandeledDates";
import { IAccessApplicationItemModel, ISimpleDictionaryViewModel } from "../interfaces";
import { accessRemoveTypeEnum, appItemTypeValues, appTypesEnum } from "../data/enums";

const getParsedRequestData = (
    data: any,
    modalValues: ISimpleDictionaryViewModel[],
    userId?: string
) => {
    const filteredData = removeEmptyValuesFromAnyLevelObject(data);
    const filteredDataWithDate = getObjectWithHandledDates(filteredData);

    const parsedReqItems: IAccessApplicationItemModel[] = [];
    modalValues.forEach((v) => {
        const needAccess = !!data[v.code];
        if (v.code === appItemTypeValues.MOBILE) {
            parsedReqItems.push({
                appItemType: v,
                needAccess,
                ...(needAccess ? { tariff: data[`item.${v.code}`] } : {})
            });
        } else {
            parsedReqItems.push({
                appItemType: v,
                needAccess,
                ...(needAccess ? { accessType: data[`item.${v.code}`] } : {})
            });
        }
    });

    let parsedReqData: any = {
        appType: filteredDataWithDate.appType,
        comment: filteredDataWithDate.comment || null,
        applicationUserId: userId ?? filteredDataWithDate.applicationUserId,
        items: parsedReqItems
    };

    if (filteredDataWithDate.appType === appTypesEnum.REMOVE_ACCESS) {
        if (filteredDataWithDate.accessRemoveType.code === accessRemoveTypeEnum.DISMISSAL) {
            parsedReqData = {
                ...parsedReqData,
                confirmationDocId: filteredDataWithDate.confirmationDocId,
                accessRemoveType: filteredDataWithDate.accessRemoveType
            };
        } else {
            parsedReqData = {
                ...parsedReqData,
                accessRemoveType: filteredDataWithDate.accessRemoveType,
                accessRemoveReason: filteredDataWithDate.accessRemoveReason,
                applicationEndDate: filteredDataWithDate.applicationEndDate || null
            };
        }
    }

    return parsedReqData;
};
export default getParsedRequestData;
