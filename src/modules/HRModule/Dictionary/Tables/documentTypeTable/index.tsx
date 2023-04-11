import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const DocumentTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.DOCUMENT_TYPE}
        modalTitle={"Новый документ"}
        selectionItems={selectionItems}
    />
);
