import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const AccessRemoveTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.ACCESS_REMOVE_TYPE}
        modalTitle={"Новый вид отзыва"}
        selectionItems={selectionItems}
    />
);
