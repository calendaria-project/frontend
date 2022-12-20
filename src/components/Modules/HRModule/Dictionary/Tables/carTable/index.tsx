import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const CarTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CAR_MODEL}
        modalTitle={"Новый автомобиль"}
        selectionItems={selectionItems}
    />
);
