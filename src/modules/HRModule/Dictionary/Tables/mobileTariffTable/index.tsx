import { FC } from "react";
import { dictionaryCodesEnum } from "data/enums";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const MobileTariffTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.MOBILE_TARIFF}
        modalTitle={"Новый мобильный тариф"}
        selectionItems={selectionItems}
    />
);
