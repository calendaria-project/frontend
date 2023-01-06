import { FC, memo } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";

interface ITableAgreementDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
}

const TableAgreementDrawer: FC<ITableAgreementDrawer> = ({ open, setOpen, currentReqData }) => {
    const onClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            title="Вернуться назад"
            width={"100vw"}
            onClose={onClose}
            open={open}
            closeIcon={<LeftOutlined />}
        >
            sdf
        </Drawer>
    );
};
export default memo(TableAgreementDrawer);
