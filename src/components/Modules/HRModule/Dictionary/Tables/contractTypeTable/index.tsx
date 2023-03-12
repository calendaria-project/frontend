import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const ContractTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.CONTRACT_TYPE}
        modalTitle={"Новый договор"}
        selectionItems={selectionItems}
    />
);
