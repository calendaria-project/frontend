import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const AnalysisMethodTypeTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.ANALYSIS_METHOD_TYPE}
        modalTitle={"Новый тип анализа"}
        selectionItems={selectionItems}
    />
);
