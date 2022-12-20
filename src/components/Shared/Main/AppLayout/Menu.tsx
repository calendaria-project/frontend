import { FC, memo, useContext } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { MenuProps } from "antd";
import { SetCurrentLayoutMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { useTypedSelector } from "hooks/useTypedSelector";
import {
    AppstoreOutlined,
    ClusterOutlined,
    DesktopOutlined,
    IdcardOutlined,
    ReadOutlined,
    ScheduleOutlined,
    ImportOutlined,
    ExportOutlined,
    ToolOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import { AuthContext } from "context/AuthContextProvider";
import { BMS_ADMIN, BMS_HEAD, BMS_HR, BMS_USER } from "context/roles";

const MenuComponent: FC = () => {
    const authContext = useContext(AuthContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const theme = useTheme();
    // @ts-ignore
    const classes = useStyles(theme);

    const current =
        useTypedSelector((state) => state.menu.layoutMenu) ||
        sessionStorage.getItem("mainMenuTab") ||
        mainMenuEnum.mainMenu;

    const onClick: MenuProps["onClick"] = (e) => {
        const menuKey = e.key;
        dispatch(SetCurrentLayoutMenu(menuKey));
        sessionStorage.setItem("mainMenuTab", menuKey);
        if (menuKey === mainMenuEnum.mainMenu) navigate("/");
        else navigate(`/${menuKey}`);
    };

    const SHARED_ITEMS = [
        {
            key: mainMenuEnum.mainMenu,
            icon: <AppstoreOutlined className={classes.icon} />,
            label: "Главное меню"
        },
        {
            key: mainMenuEnum.users,
            icon: <IdcardOutlined className={classes.icon} />,
            label: "Сотрудники"
        }
    ];

    const HR_ITEMS = [
        {
            key: mainMenuEnum.dictionary,
            icon: <ReadOutlined className={classes.icon} />,
            label: "Справочники"
        },
        {
            key: mainMenuEnum.staffing,
            icon: <ScheduleOutlined className={classes.icon} />,
            // disabled: true,
            label: "Штатное расписание"
        },
        {
            key: mainMenuEnum.organizationStructure,
            icon: <ClusterOutlined className={classes.icon} />,
            label: "Орг структура"
        },
        {
            key: mainMenuEnum.externalUsers,
            icon: <DesktopOutlined className={classes.icon} />,
            label: "Внешние пользователи"
        }
    ];

    const USER_ITEMS = [
        {
            key: mainMenuEnum.incoming,
            icon: <ImportOutlined className={classes.icon} />,
            label: "Входящие"
        },
        {
            key: mainMenuEnum.outgoing,
            icon: <ExportOutlined className={classes.icon} />,
            label: "Исходящие"
        },
        {
            key: mainMenuEnum.requests,
            icon: <ToolOutlined className={classes.icon} />,
            label: "Заявки"
        },
        {
            key: mainMenuEnum.information,
            icon: <QuestionCircleOutlined className={classes.icon} />,
            label: "Информация"
        }
    ];

    //const = ADMIN_ITEMS - все свое

    const roles = authContext.roles;
    const getItems = (): MenuProps["items"] => {
        if (roles.includes(BMS_ADMIN)) {
            return [];
        } else {
            let items = SHARED_ITEMS as MenuProps["items"];
            if (roles.includes(BMS_HR)) {
                items = [...items!, ...HR_ITEMS];
            }
            if (roles.includes(BMS_USER) || roles.includes(BMS_HEAD)) {
                items = [...items!, ...USER_ITEMS];
            }

            return items;
        }
    };

    return (
        <Menu
            className={classes.menu}
            mode="inline"
            onClick={onClick}
            selectedKeys={[current]}
            items={getItems()}
        />
    );
};
export default memo(MenuComponent);
