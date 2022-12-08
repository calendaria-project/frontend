import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../ITable";

export const ContractFormTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CONTRACT_FORM_TYPE}
        modalTitle={"Новый тип формы"}
        selectionItems={selectionItems}
    />
);
