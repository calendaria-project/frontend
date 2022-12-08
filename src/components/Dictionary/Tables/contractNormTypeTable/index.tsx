import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../ITable";

export const ContractNormTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CONTRACT_NORM_TYPE}
        modalTitle={"Новый тип нормирования труда"}
        selectionItems={selectionItems}
    />
);
