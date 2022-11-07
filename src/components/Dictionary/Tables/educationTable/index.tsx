import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const EducationTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.EDUCATION_INSTITUTION}
        modalTitle={"Новое учебное заведение"}
        selectionItems={selectionItems}
    />
);
