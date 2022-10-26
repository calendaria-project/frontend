import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const EducationTable: FC = () => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.EDUCATION_INSTITUTION}
        modalTitle={"Новое учебное заведение"}
    />
);
