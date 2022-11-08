import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const MilitaryRankTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.MILITARY_RANK}
        modalTitle={"Новая военное звание"}
        selectionItems={selectionItems}
    />
);
