import { FC } from "react";
import SharedList from "components/Shared/DictionaryTableRenderer";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";

export const AddressTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.ADDRESS_TYPE}
        modalTitle={"Новый адрес"}
        selectionItems={selectionItems}
    />
);
