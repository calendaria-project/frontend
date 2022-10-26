import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const GenderTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.SEX} modalTitle={"Новый пол"} />
);
