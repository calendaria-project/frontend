import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const ContractNormTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CONTRACT_NORM_TYPE}
        modalTitle={"Новый тип нормирования труда"}
        selectionItems={selectionItems}
    />
);
