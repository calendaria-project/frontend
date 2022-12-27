import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const AppItemTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.APP_ITEM_TYPE}
        modalTitle={"Новый доступ"}
        selectionItems={selectionItems}
    />
);
