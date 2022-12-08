import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../ITable";

export const ContractNormConditionTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CONTRACT_NORM_CONDITION}
        modalTitle={"Новое условие труда"}
        selectionItems={selectionItems}
    />
);
