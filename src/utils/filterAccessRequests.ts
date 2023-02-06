import { ALL } from "data/constants";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";
import { accessRequestStatuses } from "data/enums";

const filterRequests = (
    sortVal: string,
    reqs: [string, IAccessAppDataByCurrentUserInKeyViewModel[]][]
) => {
    switch (sortVal) {
        case accessRequestStatuses.ON_APPROVEMENT: {
            return reqs.filter(([key, _]) => key === accessRequestStatuses.ON_APPROVEMENT);
        }
        case accessRequestStatuses.ON_PROCESS: {
            return reqs.filter(([key, _]) => key === accessRequestStatuses.ON_PROCESS);
        }
        case accessRequestStatuses.DONE: {
            return reqs.filter(([key, _]) => key === accessRequestStatuses.DONE);
        }
        case accessRequestStatuses.ON_EMPLOYER_SIGN: {
            return reqs.filter(([key, _]) => key === accessRequestStatuses.ON_EMPLOYER_SIGN);
        }
        case accessRequestStatuses.REJECTED: {
            return reqs.filter(([key, _]) => key === accessRequestStatuses.REJECTED);
        }
        case accessRequestStatuses.CANCELED: {
            return reqs.filter(([key, _]) => key === accessRequestStatuses.CANCELED);
        }
        case ALL:
        default:
            return reqs;
    }
};
export default filterRequests;
