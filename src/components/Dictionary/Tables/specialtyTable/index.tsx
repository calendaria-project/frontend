import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../ITable";

export const SpecialtyTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.SPECIALTY}
        modalTitle={"Новая специальность"}
        selectionItems={selectionItems}
    />
);
