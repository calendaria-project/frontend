export enum appItemTypeValues {
    SKUD = "skud",
    MOBILE = "mobile",
    EMAIL = "email",
    BITRIX = "bitrix",
    ONE_C = "1c",
    TENDERIX = "tenderix",
    ADATA = "adata"
}

export const getPlaceholderOfAppItemTypeValue = (v: string) => {
    switch (v) {
        case appItemTypeValues.MOBILE: {
            return "Тариф";
        }
        case appItemTypeValues.ONE_C: {
            return "Только просмотр";
        }
        case appItemTypeValues.TENDERIX: {
            return "Админ";
        }
    }
};
