import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { IAccessApplicationViewModel, ICompanyViewModel, IPositionViewModel } from "interfaces";
import { ALL, ARCHIVE, ACTIVE } from "data/constants";

const useSimpleHttpFunctions = () => {
    const authContext = useContext(AuthContext);
    const [companies, setCompanies] = useState<ICompanyViewModel[]>([]);
    const [positions, setPositions] = useState<IPositionViewModel[]>([]);

    useEffect(() => {
        actionMethodResultSync(
            "DICTIONARY",
            "company?page=0&size=100&sortingRule=companyId%3AASC",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setCompanies(data.content));
    }, []);

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

    const getCurrentUserData = () => {
        return actionMethodResultSync(
            "USER",
            "user/currentUser",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => data);
    };

    const getUserData = (userId: string) => {
        return actionMethodResultSync(
            "USER",
            `user/${userId}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => data);
    };

    const getUsersByCompanyId = (
        companyId: number,
        reqType: typeof ALL | typeof ARCHIVE | typeof ACTIVE = ALL
    ) => {
        return actionMethodResultSync(
            "USER",
            `user/?companyId=${companyId}&requestType=${reqType}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => data);
    };

    const getDictionaryValues = (url: string) => {
        return actionMethodResultSync(
            "DICTIONARY",
            url,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => data);
    };

    const getDivisionOptions = (companyId: number) => {
        if (companyId) {
            return actionMethodResultSync(
                "DICTIONARY",
                `division?companyId=${companyId}&page=0&size=1000&sortingRule=divisionId%3AASC`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data.content);
        }
    };

    const getPositionOptionsByDivisionId = (divisionId: number) => {
        if (divisionId) {
            return actionMethodResultSync(
                "DICTIONARY",
                `position/divisionUnit?divisionId=${divisionId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);
        }
    };

    const getUsersWithPhotoId = async (data: any) => {
        const dataWithPhotoId = [];
        for (let i = 0; i < data.length; ++i) {
            const profilePhotoId = data[i]?.profilePhotoId;
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

    const getTreeData = (id: number) => {
        return actionMethodResultSync(
            "DICTIONARY",
            `division-unit/tree?companyId=${id}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const calculatePercent = (amount: number, percent: number) => {
        return actionMethodResultSync(
            "USER",
            `contract/calculate-percent`,
            "post",
            getRequestHeader(authContext.token),
            { amount, percent }
        ).then((data) => {
            return data;
        });
    };

    const postAccessApplication = (record: IAccessApplicationViewModel) => {
        return actionMethodResultSync(
            "HELPDESK",
            "access-application",
            "post",
            getRequestHeader(authContext.token),
            record
        ).then((data) => data);
    };

    const getAccessApplicationById = (id: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/${id}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const getAccessApplicationByUserId = (userId: string) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/by-user?userId=${userId}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const getAccessApplicationByCurrentUser = () => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/by-current-user`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const getOutgoingAccessApplication = () => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/outgoing`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const getIncomingAccessApplication = (companyId: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/incoming?companyId=${companyId}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const getAccessApplicationHistoryById = (id: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/${id}/history`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const cancelAccessApplicationById = (id: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/${id}/cancel`,
            "post",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const rejectAccessApplicationById = (data: { reason: string }, id: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/${id}/reject`,
            "post",
            getRequestHeader(authContext.token),
            data
        ).then((data) => {
            return data;
        });
    };

    const approveAccessApplicationById = (id: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/${id}/approve`,
            "post",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const doAccessApplicationTaskById = (id: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/${id}/do-app-task`,
            "post",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const signAccessApplicationTaskById = (id: number) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-application/${id}/sign`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const getAccessStorageItemsByUserId = (userId: string) => {
        return actionMethodResultSync(
            "HELPDESK",
            `access-storage/get-items-by-user?userId=${userId}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    return {
        companies,
        positions,
        initPositionOptions,
        getPositionOptions,
        getCurrentUserData,
        getUserData,
        getUsersByCompanyId,
        getUsersWithPhotoId,
        getDictionaryValues,
        getCompanyById,
        getDivisionById,
        getDivisionUnitById,
        getTreeData,
        calculatePercent,
        getDivisionOptions,
        getPositionOptionsByDivisionId,
        postAccessApplication,
        getAccessApplicationById,
        getAccessApplicationByUserId,
        getAccessApplicationByCurrentUser,
        getOutgoingAccessApplication,
        getIncomingAccessApplication,
        getAccessApplicationHistoryById,
        cancelAccessApplicationById,
        approveAccessApplicationById,
        rejectAccessApplicationById,
        doAccessApplicationTaskById,
        signAccessApplicationTaskById,
        getAccessStorageItemsByUserId
    };
};
export default useSimpleHttpFunctions;
