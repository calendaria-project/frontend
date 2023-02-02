import { Checkbox, Col, Row, Typography } from "antd";
import getFullName from "utils/getFullName";
import { getFormattedDateFromNowWithTime } from "utils/getFormattedDates";
import diffDateAndToString from "utils/diffDateAndToString";
import React, { FC, memo, useState, useEffect, Suspense, useContext } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { IAccessAppDataByCurrentUserInKeyViewModel, IUsersViewModel } from "interfaces";
import { accessItemRequestStatuses } from "data/enums";
import { getReqBallStyle } from "utils/getReqBallStyle";
import { accessItemRequestTranscripts } from "data/transcripts";
import { ITheme } from "styles/theme/interface";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";
import { AuthContext } from "context/AuthContextProvider";
import defineIsHeadingRole from "utils/defineIsHeadingRole";

const UserDrawer = React.lazy(() => import("components/Modules/UserModule/Users/userDrawer"));
const HeadingUserDrawer = React.lazy(
    () => import("components/Modules/ManagerModule/Users/userDrawer")
);

const { Text } = Typography;

interface IReqCardSharedContent {
    currentReqData: IAccessAppDataByCurrentUserInKeyViewModel;
    hideToCardBtnFlag?: boolean;
}

const ReqCardSharedContent: FC<IReqCardSharedContent> = ({ currentReqData, hideToCardBtnFlag }) => {
    const authContext = useContext(AuthContext);
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [currenUserData, setCurrentUserData] = useState({} as IUsersViewModel);

    const [appUsersWithPhoto, setAppUsersWithPhoto] = useState<IUsersWithPhotoInfoModel>(
        {} as IUsersWithPhotoInfoModel
    );
    const [cardInfoDrawerOpen, setCardInfoDrawerOpen] = useState(false);
    const [divisionsEquality, setDivisionsEquality] = useState(false);

    const creatorUserData = currentReqData.creatorUser || {};
    const applicationUserData = currentReqData.applicationUser || {};
    const creationTime = currentReqData.createdAt;
    const editionTime = currentReqData.updatedAt;

    const { getUsersWithPhotoId, getCurrentUserData } = useSimpleHttpFunctions();

    useEffect(() => {
        initCurrUserData();
    }, []);

    const initCurrUserData = async () => {
        const data = await getCurrentUserData();
        setCurrentUserData(data);
    };

    const handleOpenCardDrawer = async () => {
        const appUsersWithPhoto = await getUsersWithPhotoId([applicationUserData]);

        setDivisionsEquality(currenUserData.divisionId === applicationUserData.divisionId);
        setAppUsersWithPhoto(appUsersWithPhoto?.[0]);
        setCardInfoDrawerOpen(true);
    };

    // const handleToCardRedirect = async () => {
    //     const usersMenu = mainMenuEnum.users;
    //     dispatch(SetCurrentLayoutMenu(usersMenu));
    //     sessionStorage.setItem("mainMenuTab", usersMenu);
    //
    //     const appUsersWithPhoto = await getUsersWithPhotoId([applicationUserData]);
    //
    //     authContext.roles.includes(BMS_HR)
    //         ? navigate(`/${usersMenu}/${applicationUserData?.userId}`)
    //         : navigate(`/${usersMenu}`, { state: { userData: appUsersWithPhoto?.[0] } });
    // };

    const getItemNameAndItemStatusWithBall = (name: string, status: string) => (
        <div className={classes.statusContainer}>
            <Text>{name}</Text>
            {status !== accessItemRequestStatuses.CANCELED ? (
                <>
                    <div className={classes.statusDivider}>—</div>
                    <div className={classes.statusBall} style={getReqBallStyle(theme, status)} />
                    <Text>{accessItemRequestTranscripts[status] ?? ""}</Text>
                </>
            ) : null}
        </div>
    );

    return (
        <>
            <Row className={classes.creatorContainer}>
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>Автор заявки: </Text>
                    {getFullName(
                        creatorUserData.firstname,
                        creatorUserData.lastname,
                        creatorUserData.patronymic
                    )}
                </Col>
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>На кого создана: </Text>
                    {getFullName(
                        applicationUserData.firstname,
                        applicationUserData.lastname,
                        applicationUserData.patronymic
                    )}
                    {!hideToCardBtnFlag && (
                        <span onClick={handleOpenCardDrawer} className={classes.toCardText}>
                            Перейти на карточку сотрудника
                        </span>
                    )}
                </Col>
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>Заявка подана: </Text>
                    {getFormattedDateFromNowWithTime(creationTime)}
                </Col>
                {editionTime && (
                    <Col span={24}>
                        <Text strong>Дата последнего изменения: </Text>
                        {getFormattedDateFromNowWithTime(editionTime)}
                    </Col>
                )}
                <Col className={classes.creatorInfoCol} span={24}>
                    <Text strong>Осталось до выполнения: </Text>
                    <span className={classes.highlightedTime}>
                        {diffDateAndToString(
                            new Date(),
                            new Date(currentReqData.endDate),
                            "Время истекло"
                        )}
                    </span>
                </Col>
                <Col className={classes.titleCol} span={24}>
                    <Text className={classes.titleText}>Описание заявки</Text>
                </Col>
            </Row>
            <Row className={classes.aboutReqContainer}>
                {(currentReqData.items || []).map((item, index) => (
                    <Row
                        key={"_" + item.accessType?.code + index}
                        className={classes.aboutReqItemContainer}
                    >
                        <Checkbox
                            className={classes.aboutReqItemCheckbox}
                            disabled
                            checked={item.needAccess}
                        >
                            {getItemNameAndItemStatusWithBall(
                                item.appItemType?.nameRu,
                                item.status
                            )}
                        </Checkbox>
                        <Text className={classes.aboutReqItemStatus}>
                            {item.accessType?.nameRu ?? item.tariff?.nameRu ?? ""}
                        </Text>
                    </Row>
                ))}
            </Row>
            <Suspense>
                {defineIsHeadingRole(authContext.roles) ? (
                    <HeadingUserDrawer
                        divisionsEquality={divisionsEquality}
                        userData={appUsersWithPhoto}
                        open={cardInfoDrawerOpen}
                        setOpen={setCardInfoDrawerOpen}
                    />
                ) : (
                    <UserDrawer
                        userData={appUsersWithPhoto}
                        open={cardInfoDrawerOpen}
                        setOpen={setCardInfoDrawerOpen}
                    />
                )}
            </Suspense>
        </>
    );
};
export default memo(ReqCardSharedContent);
