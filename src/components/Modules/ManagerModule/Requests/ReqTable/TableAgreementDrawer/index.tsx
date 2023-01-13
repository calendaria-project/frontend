import { FC, memo, useEffect, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Col, Drawer, Row } from "antd";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel,
    IAccessApplicationHistoryViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import ReqCard from "./Cards/ReqCard";
import ReqExtraCard from "./Cards/ReqExtraCard";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

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

    const applicationId = currentReqData.applicationId;
    const [appHistory, setAppHistory] = useState<IAccessApplicationHistoryViewModel[]>([]);

    const { getAccessApplicationHistoryById } = useSimpleHttpFunctions();

    useEffect(() => {
        if (applicationId) {
            initAppHistory();
        }
    }, [applicationId]);

    const initAppHistory = async () => {
        const hist = await getAccessApplicationHistoryById(applicationId);
        setAppHistory(hist);
    };

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
                    <ReqCard
                        reqData={reqData}
                        currentReqData={currentReqData}
                        updateReqData={updateReqData}
                        initAppHistory={initAppHistory}
                    />
                </Col>
                <Col span={4} className={classes.reqActions}>
                    <ReqExtraCard currentReqData={currentReqData} appHistory={appHistory} />
                </Col>
            </Row>
        </Drawer>
    );
};
export default memo(TableAgreementDrawer);
