import React, { FC, memo } from "react";
import { ITable } from "../ITable";
import { Col, Input, Row, Select } from "antd";
import useStyles from "./styles";
import { useDispatch } from "react-redux";
import { SetDictionaryTabActiveKey } from "store/actions";
import { useTypedSelector } from "hooks/useTypedSelector";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";

import Button from "ui/Button";

const { Option } = Select;

interface ISearchingRow extends ITable {
    onSetIsModalVisible?: (v: boolean) => void;
}

const SearchingRow: FC<ISearchingRow> = ({ selectionItems, onSetIsModalVisible }) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const dispatch = useDispatch();
    const tabActiveKey = useTypedSelector((state) => state.menu.tabActiveKey);

    const handleChangeValue = (v: string) => {
        dispatch(SetDictionaryTabActiveKey(v));
    };

    const handleAdd = () => {
        if (onSetIsModalVisible) {
            onSetIsModalVisible(true);
        }
    };

    return (
        <Row className={classes.wrapper} gutter={24}>
            <Col>
                <Input
                    className={classes.input}
                    placeholder="Поиск"
                    suffix={<SearchOutlined style={{ color: "#828282" }} />}
                />
            </Col>
            <Col>
                <Select
                    className={classes.select}
                    value={tabActiveKey}
                    onChange={handleChangeValue}
                >
                    {(selectionItems || []).map(({ key, label }) => (
                        <Option key={key + label} value={key}>
                            {label}
                        </Option>
                    ))}
                </Select>
            </Col>
            {onSetIsModalVisible && (
                <Col className={"col-end-wrapper"}>
                    <Button customType={"regular"} onClick={handleAdd} icon={<PlusOutlined />}>
                        Добавить
                    </Button>
                </Col>
            )}
        </Row>
    );
};
export default memo(SearchingRow);
