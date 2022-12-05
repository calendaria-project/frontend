import { selectedKeyTypes } from "../data/enums";

const getUserRequestUrl = (
    selectedKey: string,
    reqMethod: "get" | "post" | "put" | "delete",
    usersId?: string
): string => {
    const currentSelectedKey =
        selectedKey === selectedKeyTypes.CONTACT_PERSONAL ||
        selectedKey === selectedKeyTypes.CONTACT_BUSINESS
            ? "contact"
            : selectedKey;

    return `${currentSelectedKey}${
        (currentSelectedKey === "contact" && reqMethod === "post") || reqMethod === "get"
            ? `/${usersId}`
            : ""
    }${
        selectedKey === selectedKeyTypes.CONTACT_PERSONAL
            ? "/personal"
            : selectedKey === selectedKeyTypes.CONTACT_BUSINESS
            ? "/business"
            : ""
    }`;
};
export default getUserRequestUrl;
