import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const SpecialtyTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.SPECIALTY}
        modalTitle={"Новая специальность"}
        selectionItems={selectionItems}
    />
);
