import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../ITable";

export const CityTable: FC<ITable> = ({ selectionItems, onSetTabActiveKey }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CITY}
        modalTitle={"Новый город"}
        selectionItems={selectionItems}
        onSetTabActiveKey={onSetTabActiveKey}
    />
);
