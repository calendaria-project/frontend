import { useContext, useEffect, useState, createElement } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, MenuProps } from "antd";
import {
    OrderedListOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ScheduleOutlined
} from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";

import MainProvider from "store/provider";
import { AuthContext } from "context/AuthContextProvider";
import Dictionary from "components/Dictionary";

import "antd/dist/antd.css";
import "../../index.css";
import Staffing from "components/Staffing";

const { Header, Sider, Content } = Layout;

const items: MenuProps["items"] = [
    {
        key: "dictionary",
        icon: <OrderedListOutlined />,
        label: "Справочники"
    },
    {
        key: "staffing",
        icon: <ScheduleOutlined />,
        label: "Штатные расписания"
    }
];

declare global {
    interface Window {
        url: string;
    }
}

const App = () => {
    const authContext = useContext(AuthContext);
    const [url, setUrl] = useState(process.env.URL || "");
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState("dictionary");
    const navigate = useNavigate();

    useEffect(() => {
        setUrl(process.env.URL || "");
    }, []);

    window.url = url;

    const onClick: MenuProps["onClick"] = (e) => {
        // console.log('click ', e);
        setCurrent(e.key);
        if (e.key === "dictionary") navigate("/");
        else navigate(`/${e.key}`);
    };

    return (
        <>
            {authContext.isAuthenticated ? (
                <MainProvider>
                    <Layout style={{ minHeight: "100vh" }}>
                        <Sider trigger={null} collapsible collapsed={collapsed}>
                            <div style={{ height: 32, margin: 16 }} />
                            <Menu
                                theme="dark"
                                mode="inline"
                                onClick={onClick}
                                selectedKeys={[current]}
                                items={items}
                            />
                        </Sider>
                        <Layout className="site-layout">
                            <Header style={{ display: "flex", padding: "0 10px" }}>
                                {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                    className: "trigger",
                                    style: {
                                        color: "white",
                                        marginTop: "auto",
                                        marginBottom: "auto",
                                        fontSize: "x-large"
                                    },
                                    onClick: () => setCollapsed(!collapsed)
                                })}
                                <ButtonGroup
                                    style={{
                                        marginTop: "auto",
                                        marginBottom: "auto",
                                        marginLeft: "auto"
                                    }}
                                >
                                    <Button color="white" onClick={() => authContext.logout()}>
                                        Logout
                                    </Button>
                                    {/* <Button
                  color='white'
                  onClick={() => authContext.updateToken()}
                >
                  Update Token
                </Button> */}
                                </ButtonGroup>
                            </Header>
                            <Content>
                                <Routes>
                                    <Route
                                        key="dictionary-route"
                                        path="/"
                                        element={<Dictionary />}
                                    />
                                    <Route
                                        key="staffing-route"
                                        path="/staffing"
                                        element={<Staffing />}
                                    />
                                </Routes>
                            </Content>
                        </Layout>
                    </Layout>
                </MainProvider>
            ) : (
                <>Loading</>
            )}
        </>
    );
};

export default App;
