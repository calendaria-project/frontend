import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { IDivisionDtoModel, IPositionDtoModel, ISimpleDictionaryModel } from "interfaces";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";

export const useInitialData = (companyId?: string) => {
    const authContext = useContext(AuthContext);
    const [divisions, setDivisions] = useState<IDivisionDtoModel[]>([]);
    const [positions, setPositions] = useState<IPositionDtoModel[]>([]);
    const [sexes, setSexes] = useState<ISimpleDictionaryModel[]>([]);

    useEffect(() => {
        getPositionOptions();
        getSexOptions();
    }, []);

    useEffect(() => {
        if (companyId && divisions.length === 0) {
            getDivisionOptions();
        }
    }, [companyId]);

    const getDivisionOptions = () => {
        if (companyId) {
            return actionMethodResultSync(
                "DICTIONARY",
                `division?companyId=${companyId}&page=0&size=1000&sortingRule=divisionId%3AASC`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => setDivisions(data.content));
        }
    };

    const getPositionOptions = () => {
        return actionMethodResultSync(
            "DICTIONARY",
            `position?page=0&size=1000&sortingRule=positionId%3AASC`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setPositions(data.content));
    };

    const getSexOptions = () => {
        return actionMethodResultSync(
            "DICTIONARY",
            `simple/SEX`,
            "get",
            getRequestHeader(authContext.token)
        ).then(setSexes);
    };

    return {
        divisions,
        positions,
        sexes
    };
};
