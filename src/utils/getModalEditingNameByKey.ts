import { selectedKeyTypes } from "data/enums";

export const getModalEditingNameByKey = (key: string): string => {
    switch (key) {
        case selectedKeyTypes.ADDITIONAL_INFO: {
            return "информацию о себе";
        }
        case selectedKeyTypes.ADDRESS_INFO: {
            return "адрес";
        }
        case selectedKeyTypes.CAR_INFO: {
            return "автомобиль";
        }
        case selectedKeyTypes.CONTACT_PERSONAL: {
            return "контакты";
        }
        case selectedKeyTypes.CONTACT_BUSINESS: {
            return "организацию";
        }
        case selectedKeyTypes.INVENTORY: {
            return "инвентарь";
        }
        case selectedKeyTypes.DOCUMENT: {
            return "документы";
        }
        case selectedKeyTypes.CONTRACT: {
            return "договора";
        }
        case selectedKeyTypes.EDUCATION: {
            return "образование";
        }
        case selectedKeyTypes.LANGUAGE_KNOWLEDGE: {
            return "иностранные языки";
        }
        case selectedKeyTypes.RELATIONSHIP: {
            return "родственные связи";
        }
        case selectedKeyTypes.MILITARY_INFO: {
            return "воинский учет";
        }
        default: {
            return "";
        }
    }
};
