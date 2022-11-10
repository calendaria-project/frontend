import { SelectedKeyTypes } from "components/Users/userItem/userExtraCard/constants";

export const getUserEditingNameByKey = (key: string): string => {
    switch (key) {
        case SelectedKeyTypes.ADDITIONAL_INFO: {
            return "информацию о себе";
        }
        case SelectedKeyTypes.ADDRESS_INFO: {
            return "адрес";
        }
        case SelectedKeyTypes.CAR_INFO: {
            return "автомобиль";
        }
        case SelectedKeyTypes.CONTACT_PERSONAL: {
            return "контакты";
        }
        case SelectedKeyTypes.CONTACT_BUSINESS: {
            return "организацию";
        }
        case SelectedKeyTypes.INVENTORY: {
            return "инвентарь";
        }
        case SelectedKeyTypes.DOCUMENT: {
            return "документы";
        }
        case SelectedKeyTypes.CONTRACT: {
            return "договора";
        }
        case SelectedKeyTypes.EDUCATION: {
            return "образование";
        }
        case SelectedKeyTypes.LANGUAGE_KNOWLEDGE: {
            return "иностранные языки";
        }
        case SelectedKeyTypes.RELATIONSHIP: {
            return "родственные связи";
        }
        case SelectedKeyTypes.MILITARY_INFO: {
            return "воинский учет";
        }
        default: {
            return "";
        }
    }
};
