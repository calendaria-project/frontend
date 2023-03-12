import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const RelationshipTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.RELATIONSHIP_TYPE}
        modalTitle={"Новое родство"}
        selectionItems={selectionItems}
    />
);
