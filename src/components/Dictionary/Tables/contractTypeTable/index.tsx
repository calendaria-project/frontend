import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";

export const ContractTypeTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.CONTRACT_TYPE} modalTitle={"Новый договор"} />
);
