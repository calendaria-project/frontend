import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const LanguageKnowledgeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.LANGUAGE_KNOWLEDGE_LEVEL}
        modalTitle={"Новый уровень владения языком"}
        selectionItems={selectionItems}
    />
);
