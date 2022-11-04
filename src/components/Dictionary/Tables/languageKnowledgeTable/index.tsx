import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const LanguageKnowledgeTable: FC<ITable> = ({ selectionItems, onSetTabActiveKey }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.LANGUAGE_KNOWLEDGE_LEVEL}
        modalTitle={"Новый уровень владения языком"}
        selectionItems={selectionItems}
        onSetTabActiveKey={onSetTabActiveKey}
    />
);
