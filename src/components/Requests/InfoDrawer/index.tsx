import { FC, memo, useEffect, useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { Col, Drawer, Row } from "antd";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessApplicationHistoryViewModel
} from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import ReqCard from "./ReqCard";
import ReqExtraCard from "./ReqExtraCard";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

interface ITableAgreementDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    currentAppId: number;
}

const SharedRequestInfoDrawer: FC<ITableAgreementDrawer> = ({ open, setOpen, currentAppId }) => {
    const onClose = () => {
        setOpen(false);
    };

    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const [currentReqData, setCurrentReqData] = useState<IAccessAppDataByCurrentUserInKeyViewModel>(
        {} as IAccessAppDataByCurrentUserInKeyViewModel
    );
    const [appHistory, setAppHistory] = useState<IAccessApplicationHistoryViewModel[]>([]);

    const { getAccessApplicationHistoryById, getAccessApplicationById } = useSimpleHttpFunctions();

    useEffect(() => {
        if (currentAppId) {
            initAppHistory();
        }
    }, [currentAppId]);

    const initAppHistory = async () => {
        const hist = await getAccessApplicationHistoryById(currentAppId);
        setAppHistory(hist);
    };

    useEffect(() => {
        if (currentAppId) {
            initCurrentReqData();
        }
    }, [currentAppId]);

    const initCurrentReqData = async () => {
        const data = await getAccessApplicationById(currentAppId);
        setCurrentReqData(data);
    };

    console.log(currentReqData);

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
                    <ReqExtraCard currentReqData={currentReqData} appHistory={appHistory} />
                </Col>
            </Row>
        </Drawer>
    );
};
export default memo(SharedRequestInfoDrawer);
