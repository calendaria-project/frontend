import { Row, Typography } from "antd";
import { CloseSquareOutlined, EditOutlined, SwapOutlined } from "@ant-design/icons";
import useStyles from "./styles";

import Button from "ui/Button";
import React, { useState } from "react";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import tempData, { ITempRoleData, riskLevelsTranscripts } from "./tempData";
import { checkIsContainRole, getFilteredRoles } from "./helpers";
import {getRiskLevelBallStyle} from "utils/getBallStyle";

const { Text } = Typography;

const Roles = () => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [selectedRoles, setSelectedRoles] = useState<ITempRoleData[]>([]);
    const emptyRolesFlag = !selectedRoles.length;

    const handleRoleClick = (clickedRole: ITempRoleData) => () => {
        if (checkIsContainRole(selectedRoles, clickedRole)) {
            setSelectedRoles(getFilteredRoles(selectedRoles, clickedRole));
        } else {
            setSelectedRoles([...selectedRoles, clickedRole]);
        }
    };

    const getRiskLevelWithBall = (riskLevel: string) => {
        return (
            <div className={classes.statusContainer}>
                <div className={classes.statusBall} style={getRiskLevelBallStyle(theme, riskLevel)} />
                <Text strong>{riskLevelsTranscripts[riskLevel] ?? ""}</Text>
            </div>
        );
    };

    return (
        <>
            <Row className={classes.btnContainer} align={"middle"}>
                <Button
                    disabled={emptyRolesFlag}
                    customType={"removingGrounded"}
                    icon={<CloseSquareOutlined />}
                >
                    Отозвать
                </Button>
                <Button
                    disabled={emptyRolesFlag}
                    customType={"addingGrounded"}
                    icon={<SwapOutlined />}
                >
                    Пересмотреть
                </Button>
                <Button disabled={emptyRolesFlag} customType={"regular"} icon={<EditOutlined />}>
                    Изменить срок
                </Button>
            </Row>
            <Row className={classes.headerRow}>
                <Text strong>Название</Text>
                <Text strong>Уровень риска</Text>
                <Text strong>Срок</Text>
            </Row>
            {tempData.map((roleItem, index) => (
                <Row
                    style={{
                        background: checkIsContainRole(selectedRoles, roleItem)
                            ? theme.background.lightedHighlight
                            : theme.background.primary
                    }}
                    key={index}
                    onClick={handleRoleClick(roleItem)}
                    className={classes.tempItem}
                >
                    <Text strong className={classes.tempItemName}>
                        {roleItem.roleName}
                    </Text>
                    {getRiskLevelWithBall(roleItem.riskLevel)}
                    <Text>{roleItem.temp}</Text>
                </Row>
            ))}
        </>
    );
};
export default Roles;
