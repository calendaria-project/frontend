import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const LanguageKnowledgeTable: FC = () => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.LANGUAGE_KNOWLEDGE_LEVEL}
        modalTitle={"Новый уровень владения языком"}
    />
);
