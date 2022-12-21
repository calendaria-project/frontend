import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const EducationTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.EDUCATION_INSTITUTION}
        modalTitle={"Новое учебное заведение"}
        selectionItems={selectionItems}
    />
);
