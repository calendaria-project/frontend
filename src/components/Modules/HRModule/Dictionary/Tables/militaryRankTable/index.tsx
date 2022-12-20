import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const MilitaryRankTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.MILITARY_RANK}
        modalTitle={"Новая военное звание"}
        selectionItems={selectionItems}
    />
);
