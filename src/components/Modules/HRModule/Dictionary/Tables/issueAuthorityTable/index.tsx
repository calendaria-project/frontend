import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const IssueAuthorityTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.ISSUE_AUTHORITY}
        modalTitle={"Новый орган выдачи"}
        selectionItems={selectionItems}
    />
);
