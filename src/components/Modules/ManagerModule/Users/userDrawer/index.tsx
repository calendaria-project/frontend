import React, { FC, memo, Suspense, useCallback, useContext, useEffect, useState } from "react";
import { Drawer, Form, message, Row } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import getFullName from "utils/getFullName";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import {
    IAccessAppDataByCurrentUserViewModel,
    IAccessApplicationItemModel,
    IAccessApplicationViewModel,
    ISimpleDictionaryViewModel
} from "interfaces";
import { accessRequestStatuses, dictionaryCodesEnum, appItemTypeValues } from "data/enums";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { AuthContext } from "context/AuthContextProvider";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import AccessRequest from "./AccessRequest";
import Spinner from "ui/Spinner";

import EmptyAccessRequest from "components/Shared/SharedRequestUsers/userDrawer/EmptyAccessRequest";
import SharedDrawerContent from "components/Shared/SharedRequestUsers/userDrawer/SharedDrawerContent";

const AddRequestModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/AccessReqModal")
);

interface IExternalUserDrawer {
    divisionsEquality: boolean;
    open: boolean;
    setOpen: (val: boolean) => void;
    userData: IUsersWithPhotoInfoModel;
}

const UserDrawer: FC<IExternalUserDrawer> = ({ divisionsEquality, open, setOpen, userData }) => {
    const authContext = useContext(AuthContext);
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles({ theme, divisionsEquality });

    const onClose = useCallback(() => setOpen(false), []);
    const userId = userData?.userId;

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalValues, setModalValues] = useState<ISimpleDictionaryViewModel[]>([]);
    const handleOpenModal = useCallback(() => setModalVisible(true), []);

    const [requestsLoading, setRequestsLoading] = useState(false);
    const [currentAccessAppRequests, setCurrentAccessAppRequests] =
        useState<IAccessAppDataByCurrentUserViewModel>({} as IAccessAppDataByCurrentUserViewModel);

    const { getDictionaryValues, getAccessApplicationByUserId } = useSimpleHttpFunctions();

    useEffect(() => {
        initModalData();
    }, []);

    const initModalData = async () => {
        const data = await getDictionaryValues(`simple/${dictionaryCodesEnum.APP_ITEM_TYPE}`);
        setModalValues(data);
    };

    useEffect(() => {
        if (divisionsEquality && userId) {
            initAccessRequests();
        }
    }, [divisionsEquality, userId]);

    const initAccessRequests = async () => {
        setRequestsLoading(true);
        const data = await getAccessApplicationByUserId(userId);
        setCurrentAccessAppRequests(data);
        setRequestsLoading(false);
    };

    const onFinishModal = useCallback(
        (data: any) => {
            const filteredData = removeEmptyValuesFromAnyLevelObject(data);
            const filteredDataWithDate = getObjectWithHandledDates(filteredData);

            const reqItems: IAccessApplicationItemModel[] = [];
            modalValues.forEach((v) => {
                const needAccess = !!data[v.code];
                if (v.code === appItemTypeValues.MOBILE) {
                    reqItems.push({
                        appItemType: v,
                        needAccess,
                        ...(needAccess ? { tariff: data[`item.${v.code}`] } : {})
                    });
                } else {
                    reqItems.push({
                        appItemType: v,
                        needAccess,
                        ...(needAccess ? { accessType: data[`item.${v.code}`] } : {})
                    });
                }
            });

            const finalReqData: IAccessApplicationViewModel = {
                appType: filteredDataWithDate.appType,
                endDate: filteredDataWithDate.endDate,
                comment: filteredDataWithDate.comment || null,
                applicationUserId: userId,
                items: reqItems
            };

            actionMethodResultSync(
                "HELPDESK",
                "access-application",
                "post",
                getRequestHeader(authContext.token),
                finalReqData
            )
                .then((d) => {
                    message.success("Успешно создано");
                    console.log(d);
                    form.resetFields();
                    setModalVisible(false);
                    setCurrentAccessAppRequests({
                        ...currentAccessAppRequests,
                        [accessRequestStatuses.ON_APPROVEMENT]: currentAccessAppRequests[
                            accessRequestStatuses.ON_APPROVEMENT
                        ]
                            ? [...currentAccessAppRequests[accessRequestStatuses.ON_APPROVEMENT], d]
                            : [d]
                    });
                })
                .catch(() => {
                    message.error("Ошибка создания!");
                });
        },
        [modalValues, userData, currentAccessAppRequests]
    );

    return (
        <Drawer
            className={classes.drawer}
            width={divisionsEquality ? "60vw" : "30vw"}
            onClose={onClose}
            open={open}
        >
            <Row className={classes.container}>
                <Row className={classes.cardContainer}>
                    <SharedDrawerContent
                        userData={userData}
                        divisionsEquality={divisionsEquality}
                        onOpenModal={handleOpenModal}
                    />
                </Row>
                {divisionsEquality && (
                    <Row className={classes.requestsContainer}>
                        {requestsLoading ? (
                            <Row className={classes.centeredRequestsContainer}>
                                <Spinner />
                            </Row>
                        ) : isObjectNotEmpty(currentAccessAppRequests) ? (
                            <AccessRequest reqData={currentAccessAppRequests} />
                        ) : (
                            <EmptyAccessRequest onOpenModal={handleOpenModal} />
                        )}
                    </Row>
                )}
            </Row>
            <Suspense>
                <AddRequestModal
                    form={form}
                    title={"Добавить заявку"}
                    isVisible={modalVisible}
                    setIsVisible={setModalVisible}
                    okText={"Добавить"}
                    onFinish={onFinishModal}
                    userName={getFullName(
                        userData.firstname,
                        userData.lastname,
                        userData.patronymic
                    )}
                    modalValues={modalValues}
                />
            </Suspense>
        </Drawer>
    );
};
export default memo(UserDrawer);
