import React, { FC, memo, useCallback } from "react";
import { Drawer, Row, Col, Image, Typography } from "antd";
import cx from "classnames";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import {
    QuestionCircleOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import getFullName from "utils/getFullName";
import { IUsersWithPhotoInfo } from "../index";
import Button from "ui/Button";
import emptyRequestsImage from "assets/icons/emptyRequests.png";

const { Text, Title } = Typography;

interface IExternalUserDrawer {
    divisionsEquality: boolean;
    open: boolean;
    setOpen: (val: boolean) => void;
    userData: IUsersWithPhotoInfo;
}

const UserDrawer: FC<IExternalUserDrawer> = ({ divisionsEquality, open, setOpen, userData }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles({ theme, divisionsEquality });

    const onClose = useCallback(() => setOpen(false), []);
    const profileImage = userData?.currentPhotoId;

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
                            onClick={() => {}}
                            className={classes.btn}
                            customType={"regular"}
                        >
                            Создать заявку на сотрудника
                        </Button>
                    </Row>
                </Row>
                {divisionsEquality && (
                    <Row className={classes.requestsContainer}>
                        <Row className={classes.emptyRequestsContainer}>
                            <Col className={classes.emptyRequests} span={24}>
                                <img src={emptyRequestsImage} alt={"empty-requests"} />
                                <Text className={classes.emptyRequestsText}>
                                    Учетные записи отсуствуют. Создайте <br />
                                    заявку или ждите новых заявок!
                                </Text>
                                <Button className={classes.createBtn} customType={"cancel"}>
                                    Создать
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                )}
            </Row>
        </Drawer>
    );
};
export default memo(UserDrawer);
