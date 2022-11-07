import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const InventoryTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.INVENTORY_TYPE}
        modalTitle={"Новый тип инвентаря"}
        selectionItems={selectionItems}
    />
);
