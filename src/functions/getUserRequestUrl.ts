import { SelectedKeyTypes } from "../components/Users/userItem/userExtraCard/constants";

const getUserRequestUrl = (
    selectedKey: string,
    reqMethod: "get" | "post" | "put" | "delete",
    usersId?: string
): string => {
    const currentSelectedKey =
        selectedKey === SelectedKeyTypes.CONTACT_PERSONAL ||
        selectedKey === SelectedKeyTypes.CONTACT_BUSINESS
            ? "contact"
            : selectedKey;

    return `${currentSelectedKey}${
        (currentSelectedKey === "contact" && reqMethod === "post") || reqMethod === "get"
            ? `/${usersId}`
            : ""
    }${
        selectedKey === SelectedKeyTypes.CONTACT_PERSONAL
            ? "/personal"
            : selectedKey === SelectedKeyTypes.CONTACT_BUSINESS
            ? "/business"
            : ""
    }`;
};
export default getUserRequestUrl;
