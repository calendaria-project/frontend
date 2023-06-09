import { Dropdown, Layout, Menu, Select, Space } from "antd";
import Button from "ui/Button";
import { BellOutlined, DownOutlined, LeftOutlined } from "@ant-design/icons";
import React, { FC, memo, useContext, useEffect, useMemo, useState } from "react";
import { actionMethodResultSync } from "http/actionMethodResult";
import { getRequestHeader } from "http/common";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import UIHeader from "ui/Header";
import { mainMenuEnum } from "data/enums";
import { useTypedSelector } from "hooks/useTypedSelector";
import { useNavigate } from "react-router";
import getFullName from "utils/getFullName";
import { mainMenuEnumTranscripts } from "data/transcripts";

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
            setUserName(getFullName(data.firstname, data.lastname));
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

    const userDropdownItems = useMemo(
        () => (
            <Menu
                items={[
                    {
                        key: "1",
                        label: (
                            <Button className={classes.dropdownBtn} customType={"primary"}>
                                Профиль
                            </Button>
                        )
                    },
                    {
                        key: "2",
                        label: (
                            <Button className={classes.dropdownBtn} customType={"primary"}>
                                Настройки
                            </Button>
                        )
                    },
                    {
                        key: "3",
                        label: (
                            <Button
                                className={classes.dropdownBtn}
                                customType={"primary"}
                                onClick={() => authContext.logout()}
                            >
                                Выйти
                            </Button>
                        )
                    }
                ]}
            />
        ),
        []
    );

    const getHeaderTitle = () => {
        if (!selectedMainMenuPoint) return null;

        const currentTranscript = mainMenuEnumTranscripts[selectedMainMenuPoint];
        if (selectedMainMenuPoint === mainMenuEnum.userItem) {
            return (
                <div className={classes.userItemHeader} onClick={() => navigate("/users")}>
                    <UIHeader size="h2">
                        <LeftOutlined /> {currentTranscript}
                    </UIHeader>
                </div>
            );
        } else {
            return <UIHeader size="h2">{currentTranscript}</UIHeader>;
        }
    };

    return (
        <AntdHeader className={classes.header}>
            {getHeaderTitle()}
            <div className={classes.selections}>
                <Select
                    className={classes.langSelection}
                    defaultValue={"Ru"}
                    options={[{ value: "Ru", label: "RU" }]}
                />
                <Button customType={"primary"}>
                    <BellOutlined className={classes.bellIcon} />
                </Button>
                <Dropdown className={classes.userDropdown} overlay={userDropdownItems}>
                    <Space className={classes.userDropdownSpace}>
                        <Button
                            className={classes.userDropdownBtn}
                            customType={"primary"}
                            icon={<DownOutlined className={classes.downIcon} />}
                        >
                            {userPhoto && (
                                <img
                                    alt={"user photo"}
                                    src={userPhoto}
                                    width={"20px"}
                                    height={"20px"}
                                    style={{ borderRadius: "50%" }}
                                />
                            )}
                            {userName}
                        </Button>
                    </Space>
                </Dropdown>
            </div>
        </AntdHeader>
    );
};
export default memo(Header);
