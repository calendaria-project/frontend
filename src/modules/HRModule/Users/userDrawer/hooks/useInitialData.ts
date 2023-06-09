import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { IDivisionViewModel, IPositionViewModel, ISimpleDictionaryViewModel } from "interfaces";
import { actionMethodResultSync } from "http/actionMethodResult";
import { getRequestHeader } from "http/common";

export const useInitialData = (companyId?: number, divisionId?: number) => {
    const authContext = useContext(AuthContext);
    const [divisions, setDivisions] = useState<IDivisionViewModel[]>([]);
    const [positions, setPositions] = useState<IPositionViewModel[]>([]);
    const [sexes, setSexes] = useState<ISimpleDictionaryViewModel[]>([]);

    useEffect(() => {
        getSexOptions();
    }, []);

    useEffect(() => {
        getPositionOptions();
    }, [divisionId]);

    useEffect(() => {
        getDivisionOptions();
    }, [companyId]);

    const getDivisionOptions = () => {
        if (companyId && divisions.length === 0) {
            return actionMethodResultSync(
                "DICTIONARY",
                `division?companyId=${companyId}&page=0&size=1000&sortingRule=divisionId%3AASC`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => setDivisions(data.content));
        }
    };

    const getPositionOptions = () => {
        if (divisionId) {
            return actionMethodResultSync(
                "DICTIONARY",
                `position/divisionUnit?divisionId=${divisionId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => {
                setPositions(data);
            });
        }
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
