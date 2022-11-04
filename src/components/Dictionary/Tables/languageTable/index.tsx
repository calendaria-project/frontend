import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const LanguageTable: FC<ITable> = ({ selectionItems, onSetTabActiveKey }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.LANGUAGE}
        modalTitle={"Новый язык"}
        selectionItems={selectionItems}
        onSetTabActiveKey={onSetTabActiveKey}
    />
);
