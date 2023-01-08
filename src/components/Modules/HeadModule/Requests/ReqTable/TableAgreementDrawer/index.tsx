import { FC, memo } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Col, Drawer, Row } from "antd";
import { IAccessAppDataByCurrentUserInKeyViewModel } from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import ReqCard from "./Cards/ReqCard";
import ReqActionsCard from "./Cards/ReqActionsCard";

interface ITableAgreementDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
}

const TableAgreementDrawer: FC<ITableAgreementDrawer> = ({ open, setOpen, currentReqData }) => {
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
                <Col span={16} className={classes.reqCard}>
                    <ReqCard reqData={currentReqData} />
                </Col>
                <Col span={8} className={classes.reqActions}>
                    <ReqActionsCard reqData={currentReqData} />
                </Col>
            </Row>
        </Drawer>
    );
};
export default memo(TableAgreementDrawer);
