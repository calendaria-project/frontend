import { Dropdown, Image, Layout, Menu, Select, Space } from "antd";
import Button from "ui/Button";
import { BellOutlined, DownOutlined, LeftOutlined } from "@ant-design/icons";
import React, { FC, memo, useContext, useEffect, useState } from "react";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import UIHeader from "ui/Header";
import { mainMenuEnum } from "data/enums";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useNavigate } from "react-router";

const { Header: AntdHeader } = Layout;

const Header: FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const selectedMainMenuPoint = useTypedSelector((state) => state.menu.openedMenu);
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [photoId, setPhotoId] = useState<string | null>(null);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        actionMethodResultSync(
            "USER",
            "user/currentUser",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            setUserName(data?.firstname || data?.username);
            setPhotoId(data?.profilePhotoId);
        });
    }, []);

    useEffect(() => {
        if (photoId) {
            actionMethodResultSync("FILE", `file/download/${photoId}/base64`, "get").then((res) => {
                setUserPhoto(res);
            });
        }
    }, [photoId]);

    const dropdownItems = <Menu />;

    return (
        <AntdHeader className={classes.header}>
            <div>
                {selectedMainMenuPoint === mainMenuEnum.staffing ? (
                    <UIHeader size="h2">Штатные расписания</UIHeader>
                ) : selectedMainMenuPoint === mainMenuEnum.dictionary ? (
                    <UIHeader size="h2">Справочники</UIHeader>
                ) : selectedMainMenuPoint === mainMenuEnum.users ? (
                    <UIHeader size="h2">Сотрудники</UIHeader>
                ) : selectedMainMenuPoint === mainMenuEnum.userItem ? (
                    <div className={classes.userItemHeader} onClick={() => navigate("/users")}>
                        <UIHeader size="h2">
                            <LeftOutlined /> Сотрудники
                        </UIHeader>
                    </div>
                ) : selectedMainMenuPoint === mainMenuEnum.organizationStructure ? (
                    <UIHeader size="h2">Орг структура</UIHeader>
                ) : null}
            </div>
            <div className={classes.selections}>
                <Select
                    className={classes.langSelection}
                    defaultValue={"Ru"}
                    options={[{ value: "Ru", label: "RU" }]}
                />
                <Button customType={"primary"}>
                    <BellOutlined className={classes.bellIcon} />
                </Button>
                <Dropdown className={classes.userDropdown} overlay={dropdownItems}>
                    <Button customType={"primary"}>
                        <Space>
                            <div className={classes.userDropdownInfo}>
                                {userPhoto && <Image className={classes.icon} src={userPhoto} />}
                                {userName}
                            </div>
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            </div>
        </AntdHeader>
    );
};
export default memo(Header);

{
    /*<ButtonGroup*/
}
{
    /*    style={{*/
}
{
    /*        marginTop: "auto",*/
}
{
    /*        marginBottom: "auto",*/
}
{
    /*        marginLeft: "auto"*/
}
{
    /*    }}*/
}
{
    /*>*/
}
{
    /*<Button color="white" onClick={() => authContext.logout()}>*/
}
{
    /*    Logout*/
}
{
    /*</Button>*/
}
{
    /* <Button
                              color='white'
                              onClick={() => authContext.updateToken()}
                            >
                              Update Token
                            </Button> */
}
{
    /*</ButtonGroup>*/
}
