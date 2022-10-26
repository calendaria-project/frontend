import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";

export const DocumentTypeTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.DOCUMENT_TYPE} modalTitle={"Новый документ"} />
);
