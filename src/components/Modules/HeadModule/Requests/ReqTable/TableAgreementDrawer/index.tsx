import { FC, memo } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Col, Drawer, Row } from "antd";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import ReqCard from "./Cards/ReqCard";
import ReqActionsCard from "./Cards/ReqActionsCard";

interface ITableAgreementDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
}

const TableAgreementDrawer: FC<ITableAgreementDrawer> = ({
    open,
    setOpen,
    reqData,
    currentReqData,
    updateReqData
}) => {
    const onClose = () => {
        setOpen(false);
    };

    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <Drawer
            title="Вернуться назад"
            width={"100vw"}
            onClose={onClose}
            open={open}
            closeIcon={<LeftOutlined />}
        >
            <Row className={classes.container}>
                <Col span={20} className={classes.reqCard}>
                    <ReqCard currentReqData={currentReqData} />
                </Col>
                <Col span={4} className={classes.reqActions}>
                    <ReqActionsCard
                        reqData={reqData}
                        currentReqData={currentReqData}
                        updateReqData={updateReqData}
                    />
                </Col>
            </Row>
        </Drawer>
    );
};
export default memo(TableAgreementDrawer);
