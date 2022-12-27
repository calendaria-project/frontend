import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const GenderTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.SEX}
        modalTitle={"Новый пол"}
        selectionItems={selectionItems}
    />
);
