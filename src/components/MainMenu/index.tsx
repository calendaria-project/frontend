import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { SetCurrentLayoutMenu, SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import {
    ICurrentUserDtoViewModel,
    IUsersDtoViewModel,
    IAllStatisticsModel,
    IBirthDateStatItem
} from "interfaces";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { Col, Row } from "antd";
import cx from "classnames";
import SmallInfoCard from "./Cards/SmallInfoCard";
import { UP, DOWN } from "./defaultValues";

import PieChartCard from "./Cards/PieChartCard";
import BirthdayInfoCard from "./Cards/BirthdayInfoCard";
import CurrentUserCard from "./Cards/CurrentUserCard";
import questionImage from "assets/icons/question.png";
import { createTableViaTabulator } from "services/tabulator";
import { externalUsersColumns } from "data/columns";
import { ColumnDefinition } from "tabulator-tables";

export interface IBirthStatItemWithPhoto extends IBirthDateStatItem {
    currentUserPhotoId: string;
}

export interface IUsersWithPhotoId extends IUsersDtoViewModel {
    currentUserPhotoId: string;
}

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

    const [allStatistics, setAllStatistics] = useState<IAllStatisticsModel>(
        {} as IAllStatisticsModel
    );
    const [table, setTable] = useState<Tabulator | undefined>();

    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<ICurrentUserDtoViewModel>(
        {} as ICurrentUserDtoViewModel
    );
    const [currentUserPhoto, setCurrentUserPhoto] = useState<string | null>(null);
    const [currentUserPhotoLoading, setCurrentUserPhotoLoading] = useState(false);

    const [birthStatsWithPhoto, setBirthStatsWithPhoto] = useState<IBirthStatItemWithPhoto[]>([]);
    const [birthStatsLoading, setBirthStatsLoading] = useState(false);

    const { getCurrentUserData } = useSimpleHttpFunctions();

    useEffect(() => {
        initStatData();
    }, [companyId]);

    useEffect(() => {
        initCurrentUserData();
    }, []);

    useEffect(() => {
        initBirthStatItems();
    }, [allStatistics]);

    useEffect(() => {
        initTableData();
    }, [allStatistics]);

    const initStatData = async () => {
        if (companyId) {
            const statistics: IAllStatisticsModel = await actionMethodResultSync(
                "USER",
                `statistics/main?companyId=${companyId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);
            setAllStatistics(statistics);
        }
    };

    console.log(birthStatsWithPhoto);

    console.log(Date.now());

    const initCurrentUserData = async () => {
        setCurrentUserPhotoLoading(true);
        const currentUserData: ICurrentUserDtoViewModel = await getCurrentUserData();

        setCompanyId(currentUserData.company?.companyId);
        setCurrentUser(currentUserData);

        const photoId = currentUserData?.profilePhotoId;
        if (photoId) {
            actionMethodResultSync("FILE", `file/download/${photoId}/base64`, "get").then((res) => {
                setCurrentUserPhotoLoading(false);
                setCurrentUserPhoto(res);
            });
        } else {
            setCurrentUserPhotoLoading(false);
            setCurrentUserPhoto(null);
        }
    };

    const initBirthStatItems = async () => {
        if (allStatistics && allStatistics.birthDateStatItems) {
            setBirthStatsLoading(true);
            const currentBirthStatsWithPhoto: IBirthStatItemWithPhoto[] = await getUsersWithPhotoId(
                allStatistics.birthDateStatItems
            );
            setBirthStatsWithPhoto(currentBirthStatsWithPhoto);
            setBirthStatsLoading(false);
        }
    };

    const fullNameTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        const data: any = cell.getData();

        const userPhoto = data.currentUserPhotoId;

        let photoElement = document.createElement("img");
        photoElement.setAttribute("src", userPhoto ? userPhoto : questionImage);
        photoElement.setAttribute("class", classes.externalUserPhoto);
        photoElement.setAttribute("width", "30px");
        photoElement.setAttribute("height", "30px");

        let textElement = document.createElement("span");
        textElement.setAttribute("class", classes.fullNameText);
        textElement.textContent = `${data.lastname ?? ""} ${data.firstname ?? ""} ${
            data.patronymic ?? ""
        }`;

        let wrap = document.createElement("div");
        wrap.setAttribute("class", classes.fullNameWrap);
        wrap.appendChild(photoElement);
        wrap.appendChild(textElement);
        return wrap;
    };

    const initTableData = async () => {
        createTableViaTabulator(
            "#cuttedExternalUsersTable",
            externalUsersColumns,
            [],
            () => {},
            true
        );
        if (allStatistics && allStatistics.externalUsers) {
            const cuttedExternalUserDataWithPhoto = await getUsersWithPhotoId(
                allStatistics.externalUsers
            );

            const actionsSell: ColumnDefinition = {
                headerSort: false,
                title: "ФИО",
                field: "fullName",
                formatter: fullNameTableActionsFormatter
            };

            await setTable(
                createTableViaTabulator(
                    "#cuttedExternalUsersTable",
                    [actionsSell, ...externalUsersColumns],
                    cuttedExternalUserDataWithPhoto,
                    () => {},
                    undefined
                )
            );
        }
    };

    const getUsersWithPhotoId = async (data: any) => {
        const usersWithPhotoId = [];
        for (let i = 0; i < data.length; ++i) {
            const profilePhotoId = data[i].profilePhotoId;
            let currentUserPhotoId;
            if (profilePhotoId) {
                currentUserPhotoId = await actionMethodResultSync(
                    "FILE",
                    `file/download/${profilePhotoId}/base64`,
                    "get"
                )
                    .then((res) => res)
                    .catch(() => undefined);
            }

            usersWithPhotoId.push({ ...data[i], currentUserPhotoId });
        }
        return usersWithPhotoId;
    };

    const onUsersCardClick = useCallback(() => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.users));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.users);
        navigate("/users");
    }, []);

    const onShowAllExternalUsersClick = useCallback(() => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.externalUsers));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.externalUsers);
        navigate("/externalUsers");
    }, []);

    return (
        <Row className={classes.container}>
            <Row className={classes.infoRow} gutter={[16, 16]}>
                <Col span={6} style={{ paddingLeft: "0px" }} className={classes.smallInfoCol}>
                    <SmallInfoCard
                        infoText={"Сотрудники"}
                        infoCount={allStatistics.allUsersCnt}
                        onClick={onUsersCardClick}
                    />
                </Col>
                <Col span={6} className={classes.smallInfoCol}>
                    <SmallInfoCard
                        infoText={"Добавлено"}
                        infoCount={allStatistics.createdUsersCnt}
                        onClick={() => {}}
                        percentage={{
                            key: UP,
                            value: `${allStatistics.createdUsersPercent}%`
                        }}
                    />
                </Col>
                <Col span={6} className={classes.smallInfoCol}>
                    <SmallInfoCard
                        infoText={"Уволено"}
                        infoCount={allStatistics.disabledUsersCnt}
                        onClick={() => {}}
                        percentage={{
                            key: DOWN,
                            value: `${allStatistics.disabledUsersPercent}%`
                        }}
                    />
                </Col>
                <Col span={6} style={{ paddingRight: "0px" }} className={classes.currentUserCol}>
                    <div className={cx(classes.sharedBorderedWrapper, classes.currentUserContent)}>
                        <CurrentUserCard
                            photoLoading={currentUserPhotoLoading}
                            currentUserPhoto={currentUserPhoto}
                            currentUser={currentUser}
                        />
                    </div>
                </Col>
                <Col span={12} style={{ paddingLeft: "0px" }} className={classes.staffingCol}>
                    <div className={classes.sharedBorderedWrapper}>Штатное расписание</div>
                </Col>
                <Col span={6} className={classes.pieChartCol}>
                    <div className={classes.sharedBorderedWrapper}>
                        <PieChartCard
                            temporaryWorkersCount={allStatistics.temporaryWorkersCnt}
                            pieceWorkersCount={allStatistics.pieceWorkersCnt}
                        />
                    </div>
                </Col>
                <Col span={6} style={{ paddingRight: "0px" }} className={classes.birthdayCol}>
                    <div className={cx(classes.sharedBorderedWrapper, classes.birthdayWrapper)}>
                        <BirthdayInfoCard
                            statItemsLoading={birthStatsLoading}
                            statItemsWithPhotoId={birthStatsWithPhoto}
                        />
                    </div>
                </Col>
            </Row>
            <Row className={classes.externalUsersRow}>
                <Row
                    align={"middle"}
                    justify={"space-between"}
                    className={classes.externalUsersTextWrapper}
                >
                    <Col>
                        <span className={classes.externalUsersTitle}>Внешние пользователи</span>
                        <span className={classes.externalUsersTitleExtra}>
                            (добавленные за последний месяц)
                        </span>
                    </Col>
                    <Col>
                        <span
                            onClick={onShowAllExternalUsersClick}
                            className={classes.externalUsersShowAll}
                        >
                            Посмотреть все
                        </span>
                    </Col>
                </Row>
                <Row className={classes.externalUsersTableRow}>
                    <div id="cuttedExternalUsersTable" />
                </Row>
            </Row>
        </Row>
    );
};
export default MainMenu;
