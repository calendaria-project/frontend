import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useContext } from "react";
import { AuthContext } from "context/AuthContextProvider";

const useSimpleHttpFunctions = () => {
    const authContext = useContext(AuthContext);

    const getCurrentUserData = () => {
        return actionMethodResultSync(
            "USER",
            "user/currentUser",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => data);
    };

    return {
        getCurrentUserData
    };
};
export default useSimpleHttpFunctions;
