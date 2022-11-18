import { useContext, useState, useEffect } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { IPositionDtoModel } from "interfaces";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";

const usePositionsData = () => {
    const authContext = useContext(AuthContext);
    const [positions, setPositions] = useState<IPositionDtoModel[]>([]);

    useEffect(() => {
        actionMethodResultSync(
            "DICTIONARY",
            `position?page=0&size=1000&sortingRule=positionId%3AASC`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setPositions(data.content));
    }, []);

    return {
        positions
    };
};
export default usePositionsData;
