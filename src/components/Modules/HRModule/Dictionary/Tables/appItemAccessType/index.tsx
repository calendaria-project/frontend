import { FC } from "react";
import { ITable } from "../../TableRenderer/ITable";
import CustomSharedList from "../../TableRenderer/CustomSharedList";

export const AppItemAccessTypeList: FC<ITable> = ({ selectionItems }) => (
    <CustomSharedList
        url={"app-item-access-type"}
        modalTitle={"Новый тип доступа"}
        selectionItems={selectionItems}
        id={"appItemTypeId"}
    />
);

export default AppItemAccessTypeList;
