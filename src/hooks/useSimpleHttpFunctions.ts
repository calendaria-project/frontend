import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { ICompanyViewModel, IPositionDtoModel } from "interfaces";

const useSimpleHttpFunctions = () => {
    const authContext = useContext(AuthContext);
    const [companies, setCompanies] = useState<ICompanyViewModel[]>([]);
    const [positions, setPositions] = useState<IPositionDtoModel[]>([]);

    useEffect(() => {
        actionMethodResultSync(
            "DICTIONARY",
            `position?page=0&size=1000&sortingRule=positionId%3AASC`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setPositions(data.content));
    }, []);

    useEffect(() => {
        actionMethodResultSync(
            "DICTIONARY",
            "company?page=0&size=100&sortingRule=companyId%ASC",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setCompanies(data.content));
    }, []);

    const getCurrentUserData = () => {
        return actionMethodResultSync(
            "USER",
            "user/currentUser",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => data);
    };

    const getUsersWithPhotoId = async (data: any) => {
        const dataWithPhotoId = [];
        for (let i = 0; i < data.length; ++i) {
            const profilePhotoId = data[i].profilePhotoId;
            let currentPhotoId;
            if (profilePhotoId) {
                currentPhotoId = await actionMethodResultSync(
                    "FILE",
                    `file/download/${profilePhotoId}/base64`,
                    "get"
                )
                    .then((res) => res)
                    .catch(() => undefined);
            }

            dataWithPhotoId.push({ ...data[i], currentPhotoId });
        }

        return dataWithPhotoId;
    };

    return {
        companies,
        positions,
        getCurrentUserData,
        getUsersWithPhotoId
    };
};
export default useSimpleHttpFunctions;
