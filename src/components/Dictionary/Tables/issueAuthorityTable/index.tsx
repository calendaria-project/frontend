import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const IssueAuthorityTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.ISSUE_AUTHORITY}
        modalTitle={"Новый орган выдачи"}
        selectionItems={selectionItems}
    />
);
