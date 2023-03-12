import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const AccessRemoveReasonTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.ACCESS_REMOVE_REASON}
        modalTitle={"Новая причина отзыва"}
        selectionItems={selectionItems}
    />
);
