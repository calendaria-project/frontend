import { TLayoutModalData } from "data/types";
import {
    ADDITIONAL_NORM,
    ADDITIONAL_TRANSFER,
    ADDITIONAL_SALARY,
    ADDITIONAL_WORK_TYPE,
    ADDITIONAL_WORKING_REGIME
} from "data/constants";

const getExtraLayoutByCode = (code: string): TLayoutModalData[] => {
    switch (code) {
        case "salary": {
            return ADDITIONAL_SALARY;
        }
        case "norm": {
            return ADDITIONAL_NORM;
        }
        case "working_hours": {
            return ADDITIONAL_WORKING_REGIME;
        }
        case "work_type": {
            return ADDITIONAL_WORK_TYPE;
        }
        case "transfer": {
            return ADDITIONAL_TRANSFER;
        }
        default: {
            return [];
        }
    }
};
export default getExtraLayoutByCode;
