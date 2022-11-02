import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";

export const AddressTypeTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.ADDRESS_TYPE} modalTitle={"Новый адрес"} />
);
