import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const RelationshipTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.RELATIONSHIP_TYPE}
        modalTitle={"Новое родство"}
        selectionItems={selectionItems}
    />
);
