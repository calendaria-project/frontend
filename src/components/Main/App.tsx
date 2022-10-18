import { useContext, useState, createElement } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, MenuProps } from "antd";
import {
    OrderedListOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ScheduleOutlined,
    IdcardOutlined
} from "@ant-design/icons";
import ButtonGroup from "antd/lib/button/button-group";

import { AuthContext } from "context/AuthContextProvider";
import Dictionary from "components/Dictionary";
import Staffing from "components/Staffing";
import StaffingItem from "components/Staffing/staffingItem";
import "antd/dist/antd.css";
import "index.css";
import Users from "components/Users";
import UserItem from "components/Users/userItem";
import Spinner from "ui/Spinner";

import { Provider } from "react-redux";
import store from "store";

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
    },
    {
        key: "users",
        icon: <IdcardOutlined />,
        label: "Сотрудники"
    }
];

const App = () => {
    const authContext = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState("dictionary");
    const navigate = useNavigate();

    const onClick: MenuProps["onClick"] = (e) => {
        // console.log('click ', e);
        setCurrent(e.key);
        if (e.key === "dictionary") navigate("/");
        else navigate(`/${e.key}`);
    };

    return (
        <>
            {authContext.isAuthenticated ? (
                <Provider store={store}>
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
                                    <Route
                                        key="staffing-item-route"
                                        path="/staffing/:staffingId"
                                        element={<StaffingItem />}
                                    />
                                    <Route key="users-route" path="/users" element={<Users />} />
                                    <Route
                                        key="users-item-route"
                                        path="/users/:usersId"
                                        element={<UserItem />}
                                    />
                                </Routes>
                            </Content>
                        </Layout>
                    </Layout>
                </Provider>
            ) : (
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Spinner />
                </div>
            )}
        </>
    );
};

export default App;
