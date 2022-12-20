import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SharedList from "components/Shared/DictionaryTableRenderer";

export const ContractFormTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CONTRACT_FORM_TYPE}
        modalTitle={"Новый тип формы"}
        selectionItems={selectionItems}
    />
);
