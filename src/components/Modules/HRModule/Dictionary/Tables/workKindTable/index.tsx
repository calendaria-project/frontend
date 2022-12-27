import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const WorkKindTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.WORK_KIND}
        modalTitle={"Новый вид работ"}
        selectionItems={selectionItems}
    />
);
