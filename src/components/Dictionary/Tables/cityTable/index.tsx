import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";

export const CityTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.CITY} modalTitle={"Новый город"} />
);
