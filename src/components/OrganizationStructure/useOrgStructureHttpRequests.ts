import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { IPositionViewModel } from "interfaces";

const useOrgStructureHttpRequests = () => {
    const authContext = useContext(AuthContext);

    const [positions, setPositions] = useState<Array<IPositionViewModel>>([]);

    useEffect(() => {
        initPositionOptions();
    }, []);

    const initPositionOptions = async () => {
        const positionOptions = await getPositionOptions();
        setPositions(positionOptions);
    };

    const getPositionOptions = () => {
        return actionMethodResultSync(
            "DICTIONARY",
            `position?page=0&size=1000&sortingRule=positionId%3AASC`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data.content;
        });
    };

    const getCompanyById = (id: number) => {
        let url = `company/${id}`;
        return actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return {};
            });
    };

    const getDivisionById = (id: number) => {
        let url = `division/${id}`;
        return actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return {};
            });
    };

    const getDivisionUnitById = (id: number) => {
        let url = `division-unit/${id}`;
        return actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return {};
            });
    };

    return {
        getCompanyById,
        getDivisionById,
        getDivisionUnitById,
        positions,
        initPositionOptions
    };
};
export default useOrgStructureHttpRequests;
