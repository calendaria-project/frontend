import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const EducationLevelTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.EDUCATION_LEVEL}
        modalTitle={"Новый уровень образования"}
        selectionItems={selectionItems}
    />
);
