import { simpleErrorCodes, simpleErrorsArr, TSimpleErrors } from "../data/errorCodes";

const getCurrentSimpleError = (errCode: TSimpleErrors) => {
    if (simpleErrorsArr.includes(errCode)) {
        return simpleErrorCodes[errCode];
    } else return "";
};
export default getCurrentSimpleError;
