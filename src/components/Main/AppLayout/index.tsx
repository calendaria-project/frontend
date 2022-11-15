import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, MenuProps } from "antd";
import { mainMenuEnum } from "data/enums";
import {
    AppstoreOutlined,
    IdcardOutlined,
    MenuOutlined,
    ReadOutlined,
    ScheduleOutlined,
    ClusterOutlined
} from "@ant-design/icons";

import "antd/dist/antd.css";

import { useTheme } from "react-jss";
import useStyles from "./styles";

import { ITheme } from "styles/theme/interface";
import Routes from "../Routes";
import Header from "./Header";

const { Sider, Content } = Layout;

const AppLayout = () => {
    const navigate = useNavigate();

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    // const [collapsed, setCollapsed] = useState(true);
    const [current, setCurrent] = useState<string>(
        sessionStorage.getItem("mainMenuTab") || mainMenuEnum.mainMenu
    );

    const onClick: MenuProps["onClick"] = (e) => {
        const menuKey = e.key;
        setCurrent(menuKey);
        sessionStorage.setItem("mainMenuTab", menuKey);
        if (menuKey === mainMenuEnum.mainMenu) navigate("/");
        else navigate(`/${menuKey}`);
    };

    const items: MenuProps["items"] = [
        {
            key: mainMenuEnum.mainMenu,
            icon: <AppstoreOutlined className={classes.icon} />,
            label: "Главное меню"
        },
        {
            key: mainMenuEnum.dictionary,
            icon: <ReadOutlined className={classes.icon} />,
            label: "Справочники"
        },
        {
            key: mainMenuEnum.staffing,
            icon: <ScheduleOutlined className={classes.icon} />,
            label: "Штатные расписания"
        },
        {
            key: mainMenuEnum.users,
            icon: <IdcardOutlined className={classes.icon} />,
            label: "Сотрудники"
        },
        {
            key: mainMenuEnum.organizationStructure,
            icon: <ClusterOutlined className={classes.icon} />,
            label: "Орг структура"
        }
    ];

    return (
        <Layout className={classes.layout}>
            <Sider className={classes.sider} trigger={null} collapsible collapsed={true}>
                <div className={classes.triggerContainer}>
                    {/*{createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {*/}
                    {/*    className: classes.trigger,*/}
                    {/*    onClick: () => setCollapsed(!collapsed)*/}
                    {/*})}*/}
                    <MenuOutlined className={classes.trigger} />
                </div>
                <Menu
                    className={classes.menu}
                    mode="inline"
                    onClick={onClick}
                    selectedKeys={[current]}
                    items={items}
                />
            </Sider>
            <Layout className="site-layout">
                <Header />
                <Content className={classes.content}>
                    <Routes />
                </Content>
            </Layout>
        </Layout>
    );
};
export default AppLayout;
