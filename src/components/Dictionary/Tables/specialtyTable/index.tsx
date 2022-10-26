import SharedList from "../SharedList";
import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";

export const SpecialtyTable: FC = () => (
    <SharedList dictionaryCode={dictionaryCodesEnum.SPECIALTY} modalTitle={"Новая специальность"} />
);
