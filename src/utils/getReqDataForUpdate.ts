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
    extractedReqStatus: string,
    baseReqStatus: string = accessRequestStatuses.ON_APPROVEMENT,
    onlyFilter?: boolean
) => {
    const {
        [baseReqStatus]: baseData,
        [extractedReqStatus]: extractedData,
        ...restReqData
    } = reqData || {};

    //transform and add current req to extracted(may be reject, cancel and so on) reqs
    return {
        ...(restReqData || {}),
        ...(getObjectLength(baseData) > 1
            ? {
                  [baseReqStatus]: baseData.filter(
                      (reqItem) => reqItem.applicationId !== appIdForFilterFromApprovement
                  )
              }
            : {}),
        ...(!onlyFilter
            ? {
                  [extractedReqStatus]: extractedData
                      ? [...extractedData, { ...currReqData, status: extractedReqStatus }]
                      : [{ ...currReqData, status: extractedReqStatus }]
              }
            : {})
    };
};
export default getReqDataForUpdate;
