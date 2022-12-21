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

const { Text, Title } = Typography;

interface IExternalUserDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    userData: IUsersWithPhotoInfo;
}

const userDrawer: FC<IExternalUserDrawer> = ({ open, setOpen, userData }) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const onClose = useCallback(() => setOpen(false), []);
    const profileImage = userData?.currentPhotoId;

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
                                userData.firstname,
                                userData.lastname,
                                userData.patronymic
                            )}
                        </Title>
                    </Col>
                    <Col className={cx(classes.phoneWrapper, classes.sharedColWrapper)} span={24}>
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
            </Row>
        </Drawer>
    );
};
export default memo(userDrawer);
