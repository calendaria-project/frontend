import { FC, memo } from "react";
import { Col, Row } from "antd";
import cx from "classnames";
import Button from "ui/Button";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import UsersIcon from "assets/svgComponents/UsersIcon";
import { UP, DOWN } from "../../defaultValues";
import UserMinusIcon from "assets/svgComponents/UserMinusIcon";
import UserPlusIcon from "assets/svgComponents/UserPlusIcon";
import UpArrowIcon from "assets/svgComponents/UpArrowIcon";
import DownArrowIcon from "assets/svgComponents/DownArrowIcon";

interface ISmallInfoCard {
    infoText: string;
    infoCount: string | number;
    onClick: () => void;
    percentage?: {
        key: string;
        value: string | number;
    };
}

const SmallInfoCard: FC<ISmallInfoCard> = ({ infoText, infoCount, onClick, percentage }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles({ theme, imageKey: percentage?.key });

    return (
        <Row className={cx(classes.sharedBorderedWrapper, classes.smallInfoContent)}>
            <Col span={24}>
                <div className={classes.imageWrapper}>
                    {percentage?.key === UP ? (
                        <UserPlusIcon color={theme.image.color.primary + ""} fontSize={"18px"} />
                    ) : percentage?.key === DOWN ? (
                        <UserMinusIcon color={theme.image.color.primary + ""} fontSize={"18px"} />
                    ) : (
                        <UsersIcon color={theme.image.color.primary + ""} fontSize={"18px"} />
                    )}
                </div>
            </Col>
            {percentage ? (
                <Row style={{ width: "100%" }} justify={"space-between"} align={"middle"}>
                    <Col className={classes.primaryInfo}>{infoText}</Col>
                    <Col>
                        {
                            <div className={classes.percentageWrapper}>
                                {percentage.key === UP ? (
                                    <UpArrowIcon color={theme.image.color.successful + ""} />
                                ) : (
                                    <DownArrowIcon color={theme.image.color.removing + ""} />
                                )}{" "}
                                {percentage.value}
                            </div>
                        }
                    </Col>
                </Row>
            ) : (
                <Col className={classes.primaryInfo} span={24}>
                    {infoText}
                </Col>
            )}
            <Row style={{ width: "100%" }} justify={"space-between"} align={"middle"}>
                <Col className={classes.secondaryInfo}>{infoCount ?? 0}</Col>
                <Col>
                    <Button onClick={onClick} customType={"regular"}>
                        Посмотреть
                    </Button>
                </Col>
            </Row>
        </Row>
    );
};
export default memo(SmallInfoCard);
