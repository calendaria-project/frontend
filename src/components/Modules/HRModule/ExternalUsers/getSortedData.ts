import { DATE, FULL_NAME, EMAIL, PHONE_NUMBER, COUNTER_PARTY, POSITION } from "./defaultValues";
import { IExternalUsersDataModel } from "interfaces";

const baseSortFoo = (firstVal: string, secondVal: string) =>
    firstVal.length > secondVal.length ? -1 : 1;

const getSortedData = (data: IExternalUsersDataModel[], sortType?: string) => {
    switch (sortType) {
        case DATE: {
            return data.sort((a: IExternalUsersDataModel, b: IExternalUsersDataModel) =>
                a.createdAt.localeCompare(b.createdAt)
            );
        }
        case FULL_NAME: {
            return data.sort((a: IExternalUsersDataModel, b: IExternalUsersDataModel) => {
                let firstVal = (a.firstname || "") + (a.lastname || "") + (a.patronymic || "");
                let secondVal = (b.firstname || "") + (b.lastname || "") + (b.patronymic || "");
                return baseSortFoo(firstVal, secondVal);
            });
        }
        case EMAIL: {
            return data.sort((a: IExternalUsersDataModel, b: IExternalUsersDataModel) => {
                let firstVal = a?.personalContact?.email || "";
                let secondVal = b?.personalContact?.email || "";
                return baseSortFoo(firstVal, secondVal);
            });
        }
        case PHONE_NUMBER: {
            return data.sort((a: IExternalUsersDataModel, b: IExternalUsersDataModel) => {
                let firstVal = a?.personalContact?.mobilePhoneNumber || "";
                let secondVal = b?.personalContact?.mobilePhoneNumber || "";
                return baseSortFoo(firstVal, secondVal);
            });
        }
        case COUNTER_PARTY: {
            return data.sort((a: IExternalUsersDataModel, b: IExternalUsersDataModel) => {
                let firstVal = a?.counterparty?.nameRu || "";
                let secondVal = b?.counterparty?.nameRu || "";
                return baseSortFoo(firstVal, secondVal);
            });
        }
        case POSITION: {
            return data.sort((a: IExternalUsersDataModel, b: IExternalUsersDataModel) => {
                let firstVal = a?.position?.nameRu || "";
                let secondVal = b?.position?.nameRu || "";
                return baseSortFoo(firstVal, secondVal);
            });
        }
        default: {
            return data;
        }
    }
};
export default getSortedData;
