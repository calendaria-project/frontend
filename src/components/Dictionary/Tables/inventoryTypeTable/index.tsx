import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const InventoryTypeTable: FC = () => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.INVENTORY_TYPE}
        modalTitle={"Новый тип инвентаря"}
    />
);
