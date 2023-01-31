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
import ReqCard from "./ReqCard";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import ReqExtraCardSharedContent from "components/Shared/SharedRequestInfoDrawer/Cards/ReqExtraCard/ReqExtraCardSharedContent";

interface ITableSignDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentAppId: number;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
}

const TableSignDrawer: FC<ITableSignDrawer> = ({
    open,
    setOpen,
    reqData,
    currentAppId,
    updateReqData
}) => {
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
                    <Row>
                        <ReqExtraCardSharedContent
                            currentReqData={currentReqData}
                            appHistory={appHistory}
                        />
                    </Row>
                </Col>
            </Row>
        </Drawer>
    );
};
export default memo(TableSignDrawer);
