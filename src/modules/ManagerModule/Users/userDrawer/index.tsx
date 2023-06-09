import React, { FC, memo, Suspense, useCallback, useContext, useEffect, useState } from "react";
import { Drawer, Form, message, Row } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import getFullName from "utils/getFullName";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";
import { IAccessAppDataByCurrentUserViewModel, ISimpleDictionaryViewModel } from "interfaces";
import { accessRequestStatuses, dictionaryCodesEnum } from "data/enums";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "http/actionMethodResult";
import { getRequestHeader } from "http/common";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import AccessRequest from "./AccessRequest";
import Spinner from "ui/Spinner";

import EmptyAccessRequest from "components/Users/userDrawer/EmptyAccessRequest";
import SharedDrawerContent from "components/Users/userDrawer/SharedDrawerContent";
import getParsedRequestData from "utils/getParsedRequestData";

const UnitedAccessReqModal = React.lazy(
    () => import("components/Requests/modals/UnitedAccessReqModal")
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
            const finalReqData = getParsedRequestData(data, modalValues, userId);

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
        [modalValues, userId, currentAccessAppRequests]
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
                <UnitedAccessReqModal
                    form={form}
                    isVisible={modalVisible}
                    setIsVisible={setModalVisible}
                    onFinish={onFinishModal}
                    userName={getFullName(
                        userData.firstname,
                        userData.lastname,
                        userData.patronymic
                    )}
                    userId={userData.userId}
                    modalValues={modalValues}
                />
            </Suspense>
        </Drawer>
    );
};
export default memo(UserDrawer);
