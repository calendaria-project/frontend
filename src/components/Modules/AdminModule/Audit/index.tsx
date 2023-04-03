import { useDispatch } from "react-redux";
import React, { FC, useEffect } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { Row, Col, Typography, Select, Input } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { SearchOutlined, SettingOutlined } from "@ant-design/icons";
import Button from "ui/Button";

const { Text } = Typography;
const { Option } = Select;

const Audit: FC = () => {
    const dispatch = useDispatch();

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.auditMenu));
    }, []);

    return (
        <Row className={classes.container}>
            <Row justify={"space-between"} align={"middle"} className={classes.selectionRow}>
                <Col>
                    <Text>За</Text>
                    <Select className={classes.select} defaultValue="today">
                        <Option value="today">Сегодня</Option>
                        <Option value="week">Неделю</Option>
                        <Option value="month">Месяц</Option>
                        <Option value="halfYear">Пол года</Option>
                        <Option value="year">Год</Option>
                    </Select>
                </Col>
                <Col>
                    <Input
                        className={classes.input}
                        placeholder="Поиск"
                        // onChange={handleFiltrationChange}
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                    <Button icon={<SettingOutlined />} customType={"regular"}>
                        Провести аудит
                    </Button>
                </Col>
            </Row>
        </Row>
    );
};
export default Audit;
