import { DATE, DEADLINE, REQ_TYPE } from "data/constants";
import { appTypesEnumTranscripts } from "data/transcripts";

import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";

const sortRequests = (
    sortVal: string,
    reqs: [string, IAccessAppDataByCurrentUserInKeyViewModel[]][]
) => {
    switch (sortVal) {
        case DATE: {
            return reqs.map(([key, allReqsInKey]) => {
                return [
                    key,
                    allReqsInKey.sort((reqA, reqB) => {
                        const firstDate = new Date(reqA.createdAt).valueOf();
                        const secondDate = new Date(reqB.createdAt).valueOf();
                        return secondDate - firstDate;
                    })
                ];
            });
        }
        case DEADLINE: {
            return reqs.map(([key, allReqsInKey]) => {
                return [
                    key,
                    allReqsInKey.sort((reqA, reqB) => {
                        const firstDate = new Date(reqA.endDate).valueOf();
                        const secondDate = new Date(reqB.endDate).valueOf();
                        return secondDate - firstDate;
                    })
                ];
            });
        }
        case REQ_TYPE: {
            return reqs.map(([key, allReqsInKey]) => {
                return [
                    key,
                    allReqsInKey.sort((reqA, reqB) => {
                        const firstReqType = appTypesEnumTranscripts[reqA.appType] || "";
                        const secondReqType = appTypesEnumTranscripts[reqB.appType] || "";
                        return firstReqType.localeCompare(secondReqType);
                    })
                ];
            });
        }
        default:
            return reqs;
    }
};
export default sortRequests;
