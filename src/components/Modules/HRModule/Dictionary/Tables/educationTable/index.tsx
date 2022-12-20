import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const EducationTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.EDUCATION_INSTITUTION}
        modalTitle={"Новое учебное заведение"}
        selectionItems={selectionItems}
    />
);
