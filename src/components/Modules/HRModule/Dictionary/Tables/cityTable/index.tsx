import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const CityTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CITY}
        modalTitle={"Новый город"}
        selectionItems={selectionItems}
    />
);
