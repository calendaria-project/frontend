import { FC, memo, useEffect, useState } from "react";
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
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

interface ITableAgreementDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    reqData: IAccessAppDataByCurrentUserViewModel;
    currentAppId: number;
    updateReqData: (data: IAccessAppDataByCurrentUserViewModel) => void;
    onlyFilterReqs?: boolean;
    hideToCardBtnFlag?: boolean;
}

const TableAgreementDrawer: FC<ITableAgreementDrawer> = ({
    open,
    setOpen,
    reqData,
    currentAppId,
    updateReqData,
    onlyFilterReqs,
    hideToCardBtnFlag
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

    const { getAccessApplicationById } = useSimpleHttpFunctions();

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
                        currentReqData={currentReqData}
                        hideToCardBtnFlag={hideToCardBtnFlag}
                    />
                </Col>
                <Col span={4} className={classes.reqActions}>
                    <ReqActionsCard
                        reqData={reqData}
                        currentReqData={currentReqData}
                        updateReqData={updateReqData}
                        onlyFilterReqs={onlyFilterReqs}
                    />
                </Col>
            </Row>
        </Drawer>
    );
};
export default memo(TableAgreementDrawer);
