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
import Tabs from "./Tabs";
import Spinner from "ui/Spinner";

import SharedDrawerContent from "components/Users/userDrawer/SharedDrawerContent";
import getParsedRequestData from "utils/getParsedRequestData";
const UnitedAccessReqModal = React.lazy(
    () => import("components/Requests/modals/UnitedAccessReqModal")
);

interface IExternalUserDrawer {
    // isCurrentUserCreatorFlag: boolean;
    // currentUserId: string;
    divisionsEquality: boolean;
    open: boolean;
    setOpen: (val: boolean) => void;
    userData: IUsersWithPhotoInfoModel;
}

const UserDrawer: FC<IExternalUserDrawer> = ({
    // isCurrentUserCreatorFlag,
    // currentUserId,
    divisionsEquality,
    open,
    setOpen,
    userData
}) => {
    const authContext = useContext(AuthContext);
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles({ theme, divisionsEquality });

    const onClose = useCallback(() => setOpen(false), []);
    const userId = userData?.userId;

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalValues, setModalValues] = useState<ISimpleDictionaryViewModel[]>([]);
    const handleOpenModal = useCallback(() => {
        setModalVisible(true);
    }, []);

    const [requestsLoading, setRequestsLoading] = useState(false);
    const [currentAccessAppRequests, setCurrentAccessAppRequests] =
        useState<IAccessAppDataByCurrentUserViewModel>({} as IAccessAppDataByCurrentUserViewModel);

    // const updateCurrentAccessAppRequests = useCallback(
    //     (v: IAccessAppDataByCurrentUserViewModel) => {
    //         setCurrentAccessAppRequests(v);
    //     },
    //     []
    // );

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
                        ) : (
                            <Tabs
                                reqData={currentAccessAppRequests}
                                openEmptyReqModal={
                                    isObjectNotEmpty(currentAccessAppRequests)
                                        ? undefined
                                        : handleOpenModal
                                }
                                // isCurrentUserCreatorFlag={isCurrentUserCreatorFlag}
                                // currentUserId={currentUserId}
                                // updateReqData={updateCurrentAccessAppRequests}
                            />
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
