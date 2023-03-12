import { FormInstance } from "antd";
import parseModalData from "utils/parseModalData";

export const parsePointObjectKey = (
    data: any,
    companyId: string | undefined,
    form: FormInstance,
    parsePhotos: boolean = true
) => {
    let parsedData: any = parseModalData(data);
    parsedData.company = { companyId };

    if (parsePhotos) {
        const signFileId = form.getFieldValue("signFileId");
        const profilePhotoId = form.getFieldValue("profilePhotoId");
        parsedData.signFileId = signFileId ? signFileId : null;
        parsedData.profilePhotoId = profilePhotoId ? profilePhotoId : null;
    }

    return parsedData;
};
