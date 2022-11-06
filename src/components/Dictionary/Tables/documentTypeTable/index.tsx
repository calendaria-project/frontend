import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../ITable";

export const DocumentTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.DOCUMENT_TYPE}
        modalTitle={"Новый документ"}
        selectionItems={selectionItems}
    />
);
