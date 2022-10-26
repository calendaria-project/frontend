import { FC } from "react";
import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";

export const CarTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.CAR_MODEL} modalTitle={"Новый автомобиль"} />
);
