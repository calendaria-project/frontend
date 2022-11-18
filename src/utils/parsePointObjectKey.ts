import { FormInstance } from "antd";

export const parsePointObjectKey = (
    data: any,
    companyId: string | undefined,
    form: FormInstance
) => {
    let parsedData: any = {};
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (key.includes(".")) {
                let arrData = key.split(".");
                parsedData[arrData[0]] = {
                    ...(parsedData[arrData[0]] ? parsedData[arrData[0]] : {}),
                    [arrData[1]]: data[key]
                };
            } else if (key.includes("Date")) {
                parsedData[key] = data[key].format("YYYY-MM-DD");
            } else {
                parsedData[key] = data[key];
            }
        }
    }
    parsedData.company = { companyId };

    const signFileId = form.getFieldValue("signFileId");
    const profilePhotoId = form.getFieldValue("profilePhotoId");
    parsedData.signFileId = signFileId ? signFileId : null;
    parsedData.profilePhotoId = profilePhotoId ? profilePhotoId : null;
    return parsedData;
};
