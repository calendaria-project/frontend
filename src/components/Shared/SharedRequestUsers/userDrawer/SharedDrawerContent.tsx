import { Col, Image, Row, Typography } from "antd";
import {
    BankOutlined,
    MailOutlined,
    PhoneOutlined,
    QuestionCircleOutlined,
    ShoppingOutlined
} from "@ant-design/icons";
import getFullName from "utils/getFullName";
import cx from "classnames";
import React, { FC, memo, useEffect, useState } from "react";
import useStyles from "./styles";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import Button from "ui/Button";

const { Text, Title } = Typography;

const SharedDrawerContent: FC<{
    userData: IUsersWithPhotoInfoModel;
    divisionsEquality?: boolean;
    onOpenModal?: () => void;
}> = ({ userData, divisionsEquality, onOpenModal }) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);
    const profileImage = userData?.currentPhotoId;

    const [divisionsEqualMsg, setDivisionsEqualMsg] = useState<boolean | undefined>(undefined);

    const handleDivisionMsg = () => {
        console.log("!");
        if (!divisionsEquality) {
            setDivisionsEqualMsg(true);
        }
    };

    console.log(divisionsEquality, divisionsEqualMsg);

    useEffect(() => {
        setDivisionsEqualMsg(false);
    }, [userData]);

    return (
        <>
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
                        {getFullName(userData.firstname, userData.lastname, userData.patronymic)}
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
            <Row className={classes.row}>
                {divisionsEquality !== undefined && divisionsEquality !== null && onOpenModal && (
                    <div onClick={handleDivisionMsg} className={classes.btnContainer}>
                        <Button
                            disabled={!divisionsEquality}
                            onClick={onOpenModal}
                            className={classes.btn}
                            customType={"regular"}
                        >
                            Создать заявку на сотрудника
                        </Button>
                        {divisionsEqualMsg && !divisionsEquality ? (
                            <span className={classes.divisionsEqualMsg}>
                                У вас нет прав для создания заявки на сотрудника
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                )}
            </Row>
        </>
    );
};

export default memo(SharedDrawerContent);
