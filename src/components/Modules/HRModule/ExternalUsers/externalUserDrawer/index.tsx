import React, { FC, memo, useCallback, useContext, useState, Suspense } from "react";
import { Drawer, Row, Col, Image, Typography, message, Form } from "antd";
import cx from "classnames";
import { IExternalUsersDataModel, IExternalUsersDtoViewModel } from "interfaces";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import {
    QuestionCircleOutlined,
    PhoneOutlined,
    MailOutlined,
    KeyOutlined,
    BankOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import getFullName from "utils/getFullName";
import Button from "ui/Button";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import { parsePointObjectKey } from "utils/parsePointObjectKey";
import _ from "lodash";
import { ALL, ARCHIVE } from "data/constants";
import { IFinishData } from "../index";

const ArchiveExternalUserModal = React.lazy(() => import("../modal/ArchiveExternalUserModal"));
const SharedExternalUserModal = React.lazy(() => import("../modal/SharedExternalUserModal"));

const { Text, Title } = Typography;

interface IExternalUserDrawer {
    requestType: string;
    table: Tabulator | undefined;
    open: boolean;
    setOpen: (val: boolean) => void;
    externalUserData: IExternalUsersDataModel;
}

const ExternalUserDrawer: FC<IExternalUserDrawer> = ({
    requestType,
    table,
    open,
    setOpen,
    externalUserData
}) => {
    const authContext = useContext(AuthContext);
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [editForm] = Form.useForm();

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [archiveModalVisible, setArchiveModalVisible] = useState(false);

    const onClose = useCallback(() => setOpen(false), []);
    const profileImage = externalUserData?.currentPhotoId;
    const companyId = externalUserData?.company?.companyId;

    const onArchiveExternalUser = useCallback(() => {
        actionMethodResultSync(
            "USER",
            `user/external/delete/${externalUserData.userId}`,
            "delete",
            getRequestHeader(authContext.token)
        )
            .then(() => {
                if (requestType !== ALL) {
                    table?.setFilter("username", "!=", externalUserData.username);
                    table?.redraw(true);
                }
                message.success("Добавлен в архив");
            })
            .catch(() => message.error("Ошибка"));
    }, [table, externalUserData]);

    const onFinishEditExternalUserDrawer = useCallback(
        async (data: IFinishData) => {
            if (externalUserData) {
                let gotData = parsePointObjectKey(
                    removeEmptyValuesFromAnyLevelObject(data),
                    companyId + "",
                    editForm,
                    false
                );

                const { fullName, currentPhotoId, ...currentPureData } = externalUserData;
                const finalData: IExternalUsersDtoViewModel = _.merge(currentPureData, gotData);
                const editedData: IExternalUsersDtoViewModel = await actionMethodResultSync(
                    "USER",
                    `user/external`,
                    "put",
                    getRequestHeader(authContext.token),
                    finalData
                )
                    .then((res) => res)
                    .catch(() => message.error("Ошибка!"));

                const editedDataWithPhoto = await getDataWithPhoto(editedData);
                const tableData = table?.getData();
                const newTableData = tableData?.map((item) => {
                    if (item.username === editedData.username) {
                        return { ...editedDataWithPhoto, fullName };
                    } else {
                        return item;
                    }
                });
                table?.replaceData(newTableData);
                table?.redraw(true);
                message.success("Успешно изменен!");
                setEditModalVisible(false);
                editForm.resetFields();
                onClose();
            }
        },
        [editForm, table, externalUserData]
    );

    const getDataWithPhoto = async (data: IExternalUsersDtoViewModel) => {
        if (data && data.profilePhotoId) {
            const currentPhotoId = await actionMethodResultSync(
                "FILE",
                `file/download/${data.profilePhotoId}/base64`,
                "get"
            )
                .then((res) => res)
                .catch(() => undefined);
            if (currentPhotoId) {
                return { ...data, currentPhotoId };
            }
        }
        return data;
    };

    return (
        <Drawer className={classes.drawer} width={"30vw"} onClose={onClose} open={open}>
            <Row className={classes.container}>
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
                                externalUserData.firstname,
                                externalUserData.lastname,
                                externalUserData.patronymic
                            )}
                        </Title>
                    </Col>
                    <Col className={cx(classes.phoneWrapper, classes.sharedColWrapper)} span={24}>
                        <PhoneOutlined className={classes.icon} />
                        <Text>{externalUserData.personalContact?.mobilePhoneNumber}</Text>
                    </Col>
                    <Col className={classes.sharedColWrapper} span={24}>
                        <MailOutlined className={classes.icon} />
                        <Text>{externalUserData.personalContact?.email}</Text>
                    </Col>
                    <Col className={classes.sharedColWrapper} span={24}>
                        <KeyOutlined className={classes.icon} />
                        <Text>{externalUserData.counterparty?.bin}</Text>
                    </Col>
                    <Col className={classes.sharedColWrapper} span={24}>
                        <ShoppingOutlined className={classes.icon} />
                        <Text>{externalUserData.position?.nameRu}</Text>
                    </Col>
                    <Col className={classes.sharedColWrapper} span={24}>
                        <BankOutlined className={classes.icon} />
                        <Text>{externalUserData.counterparty?.nameRu}</Text>
                    </Col>
                </Row>
                <Row className={classes.row}>
                    <Col className={classes.editIconWrap} span={24}>
                        <Button
                            onClick={() => setEditModalVisible(true)}
                            className={classes.btn}
                            customType={"regular"}
                        >
                            Изменить
                        </Button>
                    </Col>
                    {requestType !== ARCHIVE && (
                        <Col
                            onClick={() => setArchiveModalVisible(true)}
                            className={classes.removeIconWrap}
                            span={24}
                        >
                            <Button className={classes.btn} customType={"removing"}>
                                Добавить в архив
                            </Button>
                        </Col>
                    )}
                </Row>
            </Row>
            <Suspense>
                <ArchiveExternalUserModal
                    okText={"Удалить"}
                    title={
                        "Вы действительно хотите добавить в архив текущего внешнего пользователя"
                    }
                    isVisible={archiveModalVisible}
                    setIsVisible={setArchiveModalVisible}
                    onArchiveItem={onArchiveExternalUser}
                />
            </Suspense>
            <Suspense>
                <SharedExternalUserModal
                    okText={"Сохранить"}
                    title={"Редактировать внешнего пользователя"}
                    setIsVisible={setEditModalVisible}
                    onFinish={onFinishEditExternalUserDrawer}
                    isVisible={editModalVisible}
                    form={editForm}
                    existingData={externalUserData}
                />
            </Suspense>
        </Drawer>
    );
};
export default memo(ExternalUserDrawer);
