import React, { FC } from "react";
import { Col, Divider, Empty, Row } from "antd";
import { IDivisionStatItemsSimpleViewModel } from "interfaces";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import Spinner from "ui/Spinner";

interface IStaffingCard {
    divisionStatItems: IDivisionStatItemsSimpleViewModel[];
    statsLoading: boolean;
    onClick: () => void;
}

const StaffingCard: FC<IStaffingCard> = ({ divisionStatItems, statsLoading, onClick }) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const getStatItemClr = (userCnt: number, positionCnt: number) => {
        if (positionCnt === userCnt) {
            return theme.color.between;
        }
        if (positionCnt < userCnt) {
            return theme.color.removing;
        }
        return theme.color.secondary;
    };

    return (
        <>
            <Row justify={"space-between"} align={"middle"} className={classes.titleWrapper}>
                <Col>
                    <span className={classes.staffingTitle}>Штатное расписание</span>
                </Col>
                <Col>
                    <span onClick={onClick} className={classes.showAll}>
                        Посмотреть все
                    </span>
                </Col>
            </Row>
            <Row className={classes.contentWrapper}>
                {statsLoading ? (
                    <div className={classes.centeredWrap}>
                        <Spinner size={40} style={{ color: theme.color.regular + "" }} />
                    </div>
                ) : divisionStatItems && divisionStatItems.length ? (
                    divisionStatItems.map((statItem) => (
                        <>
                            <Row
                                justify={"space-between"}
                                align={"middle"}
                                className={classes.content}
                            >
                                <Col>{statItem.nameRu ?? ""}</Col>
                                <Col>
                                    <span
                                        style={{
                                            color:
                                                getStatItemClr(
                                                    statItem.userCnt,
                                                    statItem.positionCnt
                                                ) + ""
                                        }}
                                        className={classes.contentAmount}
                                    >
                                        {statItem.userCnt ?? 0}/{statItem.positionCnt ?? 0}
                                    </span>
                                </Col>
                            </Row>
                            <Divider className={classes.divider} />
                        </>
                    ))
                ) : (
                    <div className={classes.centeredWrap}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
            </Row>
        </>
    );
};
export default StaffingCard;
