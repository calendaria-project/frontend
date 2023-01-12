import React, { FC, memo, Suspense, useCallback, useContext, useEffect, useState } from "react";
import { Col, Drawer, Form, Image, message, Row, Typography } from "antd";
import cx from "classnames";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import {
    BankOutlined,
    MailOutlined,
    PhoneOutlined,
    QuestionCircleOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import getFullName from "utils/getFullName";
import Button from "ui/Button";
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
import EmptyAccessRequest from "./EmptyAccessRequest";
import AccessRequest from "./AccessRequest";
import Spinner from "ui/Spinner";

const AddRequestModal = React.lazy(
    () => import("components/Shared/modalRenderer/ReadyModals/AccessReqModal")
);
const { Text, Title } = Typography;

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
    const profileImage = userData?.currentPhotoId;
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
                    <Row className={classes.row}>
                        <Col span={24}>
                            <div className={classes.imageWrapper}>
                                {profileImage ? (
                                    <Image
                                        className={classes.userImage}
                                        width={100}
                                        height={100}
                                        src={profileImage}
                                    />
                                ) : (
                                    <QuestionCircleOutlined />
                                )}
                            </div>
                        </Col>
                        <Col className={classes.textWrapper} span={24}>
                            <Title level={5}>
                                {getFullName(
                                    userData.firstname,
                                    userData.lastname,
                                    userData.patronymic
                                )}
                            </Title>
                        </Col>
                        <Col
                            className={cx(classes.phoneWrapper, classes.sharedColWrapper)}
                            span={24}
                        >
                            <PhoneOutlined className={classes.icon} />
                            <Text>{userData.personalContact?.mobilePhoneNumber}</Text>
                        </Col>
                        <Col className={classes.sharedColWrapper} span={24}>
                            <MailOutlined className={classes.icon} />
                            <Text>{userData.personalContact?.email}</Text>
                        </Col>
                        <Col className={classes.sharedColWrapper} span={24}>
                            <ShoppingOutlined className={classes.icon} />
                            <Text>{userData.position?.nameRu}</Text>
                        </Col>
                        <Col className={classes.sharedColWrapper} span={24}>
                            <BankOutlined className={classes.icon} />
                            <Text>{userData.company?.nameRu}</Text>
                        </Col>
                        <Col className={classes.sharedColWrapper} span={24}>
                            <BankOutlined className={classes.disabledIcon} />
                            <Text>{userData.division?.nameRu}</Text>
                        </Col>
                    </Row>
                    <Row className={classes.row}>
                        <Button
                            disabled={!divisionsEquality}
                            onClick={handleOpenModal}
                            className={classes.btn}
                            customType={"regular"}
                        >
                            Создать заявку на сотрудника
                        </Button>
                    </Row>
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
