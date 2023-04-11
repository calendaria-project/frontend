import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const MilitaryRankTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.MILITARY_RANK}
        modalTitle={"Новая военное звание"}
        selectionItems={selectionItems}
    />
);
