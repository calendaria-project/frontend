import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { SetCurrentLayoutMenu, SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { IUsersViewModel, IAllStatisticsViewModel } from "interfaces";
import { IBirthStatItemWithPhotoModel } from "interfaces/extended";
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
import { createTableViaTabulator, fullNameTableActionsFormatter } from "services/tabulator";
import { externalUsersColumns } from "data/columns";
import { ColumnDefinition } from "tabulator-tables";
import StaffingCard from "./Cards/StaffingCard";
import { ALL, ARCHIVE, ACTIVE } from "data/constants";

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

    const [allStatistics, setAllStatistics] = useState<IAllStatisticsViewModel>(
        {} as IAllStatisticsViewModel
    );
    const [statsLoading, setStatsLoading] = useState(false);
    const [table, setTable] = useState<Tabulator | undefined>();

    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<IUsersViewModel>({} as IUsersViewModel);
    const [currentUserPhoto, setCurrentUserPhoto] = useState<string | null>(null);
    const [currentUserPhotoLoading, setCurrentUserPhotoLoading] = useState(false);

    const [birthStatsWithPhoto, setBirthStatsWithPhoto] = useState<IBirthStatItemWithPhotoModel[]>(
        []
    );
    const [birthStatsLoading, setBirthStatsLoading] = useState(false);

    const { getCurrentUserData, getUsersWithPhotoId } = useSimpleHttpFunctions();

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
            setStatsLoading(true);
            const statistics: IAllStatisticsViewModel = await actionMethodResultSync(
                "USER",
                `statistics/main?companyId=${companyId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);
            setAllStatistics(statistics);
            setStatsLoading(false);
        }
    };

    const initCurrentUserData = async () => {
        setCurrentUserPhotoLoading(true);
        const currentUserData: IUsersViewModel = await getCurrentUserData();

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

    console.log(allStatistics);

    const initBirthStatItems = async () => {
        setBirthStatsLoading(true);
        if (allStatistics && allStatistics.birthDateStatItems) {
            const currentBirthStatsWithPhoto: IBirthStatItemWithPhotoModel[] =
                await getUsersWithPhotoId(allStatistics.birthDateStatItems);
            setBirthStatsWithPhoto(currentBirthStatsWithPhoto);
            setBirthStatsLoading(false);
        }
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

    const onUsersCardClick = useCallback(() => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.users));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.users);
        sessionStorage.setItem("userReqType", ALL);
        navigate("/users");
    }, []);

    const onActiveUsersCardClick = useCallback(() => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.users));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.users);
        sessionStorage.setItem("userReqType", ACTIVE);
        navigate("/users");
    }, []);

    const onArchiveUsersCardClick = useCallback(() => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.users));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.users);
        sessionStorage.setItem("userReqType", ARCHIVE);
        navigate("/users");
    }, []);

    const onStaffingCardClick = useCallback(() => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.users));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.staffing);
        navigate("/staffing");
    }, []);

    const onShowAllExternalUsersClick = useCallback(() => {
        dispatch(SetCurrentLayoutMenu(mainMenuEnum.externalUsers));
        sessionStorage.setItem("mainMenuTab", mainMenuEnum.externalUsers);
        navigate("/externalUsers");
    }, []);

    return (
        <Row className={classes.container}>
            <Row className={classes.infoRow} gutter={[16, 16]}>
                <Col span={6} className={classes.smallInfoCol}>
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
                        onClick={onActiveUsersCardClick}
                        percentage={{
                            key: UP,
                            value: `${allStatistics.createdUsersPercent ?? 0}%`
                        }}
                    />
                </Col>
                <Col span={6} className={classes.smallInfoCol}>
                    <SmallInfoCard
                        infoText={"Уволено"}
                        infoCount={allStatistics.disabledUsersCnt}
                        onClick={onArchiveUsersCardClick}
                        percentage={{
                            key: DOWN,
                            value: `${allStatistics.disabledUsersPercent ?? 0}%`
                        }}
                    />
                </Col>
                <Col span={6} className={classes.currentUserCol}>
                    <div className={cx(classes.sharedBorderedWrapper, classes.currentUserContent)}>
                        <CurrentUserCard
                            photoLoading={currentUserPhotoLoading}
                            currentUserPhoto={currentUserPhoto}
                            currentUser={currentUser}
                        />
                    </div>
                </Col>
                <Col span={12} className={classes.staffingCol}>
                    <div className={classes.sharedBorderedWrapper}>
                        <StaffingCard
                            divisionStatItems={allStatistics.divisionStatItems}
                            statsLoading={statsLoading}
                            onClick={onStaffingCardClick}
                        />
                    </div>
                </Col>
                <Col span={6} className={classes.pieChartCol}>
                    <div className={classes.sharedBorderedWrapper}>
                        <PieChartCard
                            temporaryWorkersCount={allStatistics.temporaryWorkersCnt}
                            pieceWorkersCount={allStatistics.pieceWorkersCnt}
                        />
                    </div>
                </Col>
                <Col span={6} className={classes.birthdayCol}>
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
                        <span className={classes.externalUsersTitle}>Внешние пользователи </span>
                        <span className={classes.externalUsersTitleExtra}>
                            (добавленные за последний месяц)
                        </span>
                    </Col>
                    <Col>
                        <span onClick={onShowAllExternalUsersClick} className={classes.showAll}>
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
