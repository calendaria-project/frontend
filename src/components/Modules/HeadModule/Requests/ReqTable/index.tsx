import { Row, Typography } from "antd";
import React, { FC, memo, Suspense, useState } from "react";
import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel,
    IAccessApplicationItemViewModel
} from "interfaces";
import {
    accessRequestTranscripts,
    appTypesEnumTranscripts,
    accessItemRequestTranscripts,
    accessItemRequestStatuses
} from "data/enums";

import emptyImage from "assets/icons/question.png";

import getFullName from "utils/getFullName";
import Button from "ui/Button";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import EmptyTableContent from "components/Shared/tableRenderer/EmptyTableContent";
import { getFormattedDateFromNow } from "utils/getFormattedDates";

const { Text } = Typography;
const AgreementDrawer = React.lazy(() => import("./TableAgreementDrawer"));

const ReqTable: FC<{
    reqData: IAccessAppDataByCurrentUserViewModel;
    setReqData: (v: IAccessAppDataByCurrentUserViewModel) => void;
}> = ({ reqData, setReqData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [agreementDrawerOpened, setAgreementDrawerOpened] = useState(false);
    const [currentReqData, setCurrentReqData] = useState(
        {} as IAccessAppDataByCurrentUserInKeyViewModel
    );

    const handleOpenDrawer = (data: IAccessAppDataByCurrentUserInKeyViewModel) => () => {
        setCurrentReqData(data);
        setAgreementDrawerOpened(true);
    };

    const getCurrentReqStatus = (items: IAccessApplicationItemViewModel[]) => {
        return items.find((el) => el.status === accessItemRequestStatuses.ON_PROCESS)
            ? accessItemRequestStatuses.ON_PROCESS
            : items.find((el) => el.status === accessItemRequestStatuses.DONE)
            ? accessItemRequestStatuses.DONE
            : accessItemRequestStatuses.CANCELED;
    };

    const getReqStatusWithBall = (itemStatus: string) => {
        return (
            <div className={classes.statusContainer}>
                <div
                    className={classes.statusBall}
                    style={{
                        background:
                            itemStatus === accessItemRequestStatuses.CANCELED
                                ? theme.color.removing + ""
                                : itemStatus === accessItemRequestStatuses.DONE
                                ? theme.color.successful + ""
                                : theme.color.between + ""
                    }}
                />
                <Text strong>{accessItemRequestTranscripts[itemStatus] ?? ""}</Text>
            </div>
        );
    };

    return (
        <Row className={classes.wrapper}>
            <Row className={classes.headerRow}>
                <Text className={classes.headerText}>ФИО</Text>
                <Text className={classes.headerText}>Вид заявки</Text>
                <Text className={classes.headerText}>Дата отправки</Text>
                <Text className={classes.headerText}>Дедлайн заявки</Text>
                <Text className={classes.headerText}>Статус</Text>
                <Text className={classes.headerText}>Действия</Text>
            </Row>
            {isObjectNotEmpty(reqData) ? (
                <Row className={classes.allReqsRow}>
                    {Object.entries(reqData).map(([key, data], index) => (
                        <React.Fragment key={"_" + key + index}>
                            <Row className={classes.reqTitle}>
                                <Text className={classes.reqTitleText}>
                                    {accessRequestTranscripts[key]}
                                </Text>
                            </Row>
                            {(data || []).map((accessItem) => {
                                const currentReqStatus = getCurrentReqStatus(accessItem.items);
                                const profilePhoto = accessItem.applicationUser?.currentPhotoId;
                                return (
                                    <Row
                                        key={accessItem.applicationId}
                                        className={classes.reqContainer}
                                    >
                                        <div className={classes.accessItemFioContainer}>
                                            <img
                                                className={classes.accessItemFioImg}
                                                alt={""}
                                                src={profilePhoto ? profilePhoto : emptyImage}
                                            />
                                            <span className={classes.accessItemFioText}>
                                                {getFullName(
                                                    accessItem.applicationUser?.firstname,
                                                    accessItem.applicationUser?.lastname,
                                                    accessItem.applicationUser?.patronymic
                                                )}
                                            </span>
                                        </div>
                                        <Text className={classes.reqTypeText} strong>
                                            {appTypesEnumTranscripts[accessItem.appType] ?? ""}
                                        </Text>
                                        <Text>{getFormattedDateFromNow(accessItem.createdAt)}</Text>
                                        <Text>{getFormattedDateFromNow(accessItem.endDate)}</Text>
                                        {getReqStatusWithBall(currentReqStatus)}
                                        {currentReqStatus ===
                                        accessItemRequestStatuses.ON_PROCESS ? (
                                            <Button
                                                customType={"regular"}
                                                onClick={handleOpenDrawer(accessItem)}
                                                className={classes.toAccessBtn}
                                            >
                                                Перейти к согласованию
                                            </Button>
                                        ) : (
                                            <div className={classes.emptyDiv} />
                                        )}
                                    </Row>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </Row>
            ) : (
                <EmptyTableContent />
            )}
            <Suspense>
                <AgreementDrawer
                    open={agreementDrawerOpened}
                    setOpen={setAgreementDrawerOpened}
                    currentReqData={currentReqData}
                />
            </Suspense>
        </Row>
    );
};

export default memo(ReqTable);
