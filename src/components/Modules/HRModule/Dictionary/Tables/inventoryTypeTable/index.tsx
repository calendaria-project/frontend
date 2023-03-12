import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const InventoryTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.INVENTORY_TYPE}
        modalTitle={"Новый тип инвентаря"}
        selectionItems={selectionItems}
    />
);
