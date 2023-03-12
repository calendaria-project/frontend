import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const SelectionMethodTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.SELECTION_METHOD_TYPE}
        modalTitle={"Новый тип выбора"}
        selectionItems={selectionItems}
    />
);
