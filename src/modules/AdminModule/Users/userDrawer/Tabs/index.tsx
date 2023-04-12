import { Row, Tabs } from "antd";
import React, { FC, useState } from "react";
import AccessRequests from "./AccessRequests";
import { IAccessAppDataByCurrentUserViewModel } from "interfaces";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import Accounts from "./Accounts";
import EmptyAccessRequest from "components/Users/userDrawer/EmptyAccessRequest";
import Roles from "./Roles";

const TabsComponent: FC<{
    reqData: IAccessAppDataByCurrentUserViewModel;
    openEmptyReqModal: (() => void) | undefined;
}> = ({ reqData, openEmptyReqModal }) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [activeKey, setActiveKey] = useState("1");

    return (
        <Row className={classes.container}>
            <Tabs
                activeKey={activeKey}
                onChange={(key) => setActiveKey(key)}
                items={[
                    {
                        label: "Заявки",
                        key: "1",
                        children: openEmptyReqModal ? (
                            <Row className={classes.emptyReqWrapper}>
                                <EmptyAccessRequest onOpenModal={openEmptyReqModal} />
                            </Row>
                        ) : (
                            <AccessRequests reqData={reqData} />
                        )
                    },
                    {
                        label: "Учетные записи",
                        key: "2",
                        children: <Accounts />
                    },
                    {
                        label: "Роли",
                        key: "3",
                        children: <Roles />
                    }
                ]}
            />
        </Row>
    );
};

export default TabsComponent;
