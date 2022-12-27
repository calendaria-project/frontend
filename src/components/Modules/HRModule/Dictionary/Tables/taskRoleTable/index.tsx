import { dictionaryCodesEnum } from "data/enums";
import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import SharedList from "../../TableRenderer";

export const TaskRoleTable: FC<ITable> = ({ selectionItems }) => (
    <SharedList
        dictionaryCode={dictionaryCodesEnum.TASK_ROLE}
        modalTitle={"Новая роль"}
        selectionItems={selectionItems}
    />
);
