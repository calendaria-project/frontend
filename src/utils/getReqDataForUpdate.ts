import { accessRequestStatuses } from "data/enums";
import { getObjectLength } from "./isObjectNotEmpty";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel
} from "../interfaces";

const getReqDataForUpdate = (
    reqData: IAccessAppDataByCurrentUserViewModel,
    currReqData: IAccessAppDataByCurrentUserInKeyViewModel,
    appIdForFilterFromApprovement: number,
    extractedReqStatus: string
) => {
    const {
        [accessRequestStatuses.ON_APPROVEMENT]: onApprovedData,
        [extractedReqStatus]: extractedData,
        ...restReqData
    } = reqData || {};

    //transform and add current req to extracted(may be reject, cancel and so on) reqs
    return {
        ...(restReqData || {}),
        ...(getObjectLength(onApprovedData) > 1
            ? {
                  [accessRequestStatuses.ON_APPROVEMENT]: onApprovedData.filter(
                      (reqItem) => reqItem.applicationId !== appIdForFilterFromApprovement
                  )
              }
            : {}),
        [extractedReqStatus]: extractedData
            ? [...extractedData, { ...currReqData, status: extractedReqStatus }]
            : [{ ...currReqData, status: extractedReqStatus }]
    };
};
export default getReqDataForUpdate;
