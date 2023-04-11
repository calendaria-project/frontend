import { Layout } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import "antd/dist/antd.css";

import { useTheme } from "react-jss";
import useStyles from "./styles";

import { ITheme } from "styles/theme/interface";
import Routes from "../Routes";
import Header from "./Header";
import Menu from "./Menu";

const { Sider, Content } = Layout;

const AppLayout = () => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

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
                <Menu />
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
