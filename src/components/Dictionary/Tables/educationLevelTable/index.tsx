import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const EducationLevelTable: FC = () => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.EDUCATION_LEVEL}
        modalTitle={"Новый уровень образования"}
    />
);
