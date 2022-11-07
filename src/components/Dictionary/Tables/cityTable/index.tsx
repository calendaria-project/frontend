import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../ITable";

export const CityTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CITY}
        modalTitle={"Новый город"}
        selectionItems={selectionItems}
    />
);
