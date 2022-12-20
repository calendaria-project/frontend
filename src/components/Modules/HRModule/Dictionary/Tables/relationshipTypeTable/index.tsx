import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const RelationshipTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.RELATIONSHIP_TYPE}
        modalTitle={"Новое родство"}
        selectionItems={selectionItems}
    />
);
