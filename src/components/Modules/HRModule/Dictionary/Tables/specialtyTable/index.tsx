import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const SpecialtyTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.SPECIALTY}
        modalTitle={"Новая специальность"}
        selectionItems={selectionItems}
    />
);
