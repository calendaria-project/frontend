import { FC, useContext, useEffect, useState } from "react";
import { SetCurrentLayoutMenu, SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { ICurrentUserDtoViewModel, IUsersDtoViewModel } from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { Col, Row, Typography } from "antd";
import cx from "classnames";
import Button from "ui/Button";
import SmallInfoCard from "./SmallInfoCard";
import { UP, DOWN } from "./defaultValues";

const { Text } = Typography;

const MainMenu: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.mainMenu));
    }, []);

    const [currentUser, setCurrentUser] = useState<ICurrentUserDtoViewModel>(
        {} as ICurrentUserDtoViewModel
    );
    const [users, setUsers] = useState<IUsersDtoViewModel[]>([]);

    const { getCurrentUserData } = useSimpleHttpFunctions();

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        const currentUserData: ICurrentUserDtoViewModel = await getCurrentUserData();
        setCurrentUser(currentUserData);
        if (currentUserData) {
            const companyId = currentUserData.company?.companyId;
            const userData: IUsersDtoViewModel[] = await actionMethodResultSync(
                "USER",
                `user?companyId=${companyId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);
            setUsers(userData);
        }
    };

    const onUsersCardClick = () => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.users));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.users);
        navigate("/users");
    };

    return (
        <Row className={classes.container}>
            <Row className={classes.infoRow} gutter={[16, 16]}>
                <Col span={6} style={{ paddingLeft: "0px" }} className={classes.smallInfoCol}>
                    <SmallInfoCard
                        infoText={"Сотрудники"}
                        infoCount={users.length}
                        onClick={onUsersCardClick}
                    />
                </Col>
                <Col span={6} className={classes.smallInfoCol}>
                    <SmallInfoCard
                        infoText={"Добавлено"}
                        infoCount={users.length}
                        onClick={() => {}}
                        percentage={{
                            key: UP,
                            value: "34%"
                        }}
                    />
                </Col>
                <Col span={6} className={classes.smallInfoCol}>
                    <SmallInfoCard
                        infoText={"Уволено"}
                        infoCount={users.length}
                        onClick={() => {}}
                        percentage={{
                            key: DOWN,
                            value: "12.5%"
                        }}
                    />
                </Col>
                <Col span={6} style={{ paddingRight: "0px" }} className={classes.currentUserCol}>
                    <div className={cx(classes.sharedBorderedWrapper, classes.currentUserContent)}>
                        Сотрудники
                    </div>
                </Col>
                <Col span={12} style={{ paddingLeft: "0px" }} className={classes.staffingCol}>
                    <div className={classes.sharedBorderedWrapper}>Штатное</div>
                </Col>
                <Col span={6} className={classes.pieChartCol}>
                    <div className={classes.sharedBorderedWrapper}>chart</div>
                </Col>
                <Col span={6} style={{ paddingRight: "0px" }} className={classes.birthdayCol}>
                    <div className={classes.sharedBorderedWrapper}>ДР</div>
                </Col>
            </Row>
            <Row className={classes.externalUsersRow}>
                <Row className={classes.externalUsersText}>
                    <Col>Внешние пользователи (добавленные за последний месяц)</Col>
                    <Col>Посмотреть все</Col>
                </Row>
                <Row className={classes.externalUsersTableRow}></Row>
            </Row>
        </Row>
    );
};
export default MainMenu;
