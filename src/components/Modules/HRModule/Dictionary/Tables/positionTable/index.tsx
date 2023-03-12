import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import CustomSharedList from "../../TableRenderer/CustomSharedList";

export const PositionTable: FC<ITable> = ({ selectionItems }) => (
    <CustomSharedList
        url={"position"}
        modalTitle={"Новая должность"}
        selectionItems={selectionItems}
        id={"positionId"}
    />
);

export default PositionTable;
