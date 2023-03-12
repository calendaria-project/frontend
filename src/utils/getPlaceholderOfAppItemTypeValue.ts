import { appItemTypeValues } from "data/enums";

const getPlaceholderOfAppItemTypeValue = (v: string) => {
    switch (v) {
        case appItemTypeValues.MOBILE: {
            return "Выберите тариф";
        }
        case appItemTypeValues.ONE_C: {
            return "Выберите права";
        }
        case appItemTypeValues.TENDERIX: {
            return "Выберите роль";
        }
        default: {
            return undefined;
        }
    }
};

export default getPlaceholderOfAppItemTypeValue;
