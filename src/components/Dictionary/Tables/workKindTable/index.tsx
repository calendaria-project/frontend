import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const WorkKindTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.WORK_KIND}
        modalTitle={"Новый вид работ"}
        selectionItems={selectionItems}
    />
);
