import { useContext, useEffect, useState } from "react";
import { ICompanyViewModel } from "interfaces";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";

const useCompaniesData = () => {
    const authContext = useContext(AuthContext);
    const [companies, setCompanies] = useState<ICompanyViewModel[]>([]);

    useEffect(() => {
        actionMethodResultSync(
            "DICTIONARY",
            "company?page=0&size=100&sortingRule=companyId%ASC",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => setCompanies(data.content));
    }, []);

    return {
        companies
    };
};
export default useCompaniesData;
