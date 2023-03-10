import { Row, Typography } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import useStyles from "./styles";

import Button from "ui/Button";
import React, { useState } from "react";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import tempData, { ITempAccountData } from "./tempData";
import _ from "lodash";

const { Text } = Typography;

const Accounts = () => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [selectedAcc, setSelectedAcc] = useState<ITempAccountData | undefined>(undefined);

    return (
        <>
            <Row>
                <Button disabled={!selectedAcc} customType={"regular"} icon={<KeyOutlined />}>
                    Сменить пароль
                </Button>
            </Row>
            <Row className={classes.headerRow}>
                <Text strong>Приложение</Text>
                <Text strong>Дата создания</Text>
                <Text strong>УЗ</Text>
                <Text strong>Тип</Text>
            </Row>
            {tempData.map((accElem, index) => (
                <Row
                    key={index}
                    onClick={() => setSelectedAcc(accElem)}
                    className={classes.tempItem}
                    style={{
                        background: _.isEqual(selectedAcc, accElem)
                            ? theme.background.lightedHighlight
                            : theme.background.primary
                    }}
                >
                    <Text>{accElem.appName}</Text>
                    <Text>{accElem.createDate}</Text>
                    <Text>{accElem.email}</Text>
                    <Text>{accElem.type}</Text>
                </Row>
            ))}
        </>
    );
};
export default Accounts;
