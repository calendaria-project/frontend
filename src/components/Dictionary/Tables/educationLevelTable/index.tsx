import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const EducationLevelTable: FC<ITable> = ({ selectionItems, onSetTabActiveKey }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.EDUCATION_LEVEL}
        modalTitle={"Новый уровень образования"}
        selectionItems={selectionItems}
        onSetTabActiveKey={onSetTabActiveKey}
    />
);
