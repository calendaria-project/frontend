import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const IssueAuthorityTable: FC = () => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.ISSUE_AUTHORITY}
        modalTitle={"Новый орган выдачи"}
    />
);
