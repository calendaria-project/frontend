import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const LanguageTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.LANGUAGE} modalTitle={"Новый язык"} />
);
