import React, { FC, memo, useCallback, useEffect, useState } from "react";
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
import useDelayedInputSearch from "hooks/useDelayedInputSearch";

const { Option } = Select;

interface ISearchingRow extends ITable {
    onSetIsModalVisible?: (v: boolean) => void;
    onSetSearchStr?: (v: string) => void;
}

const SearchingRow: FC<ISearchingRow> = ({
    selectionItems,
    onSetIsModalVisible,
    onSetSearchStr
}) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const dispatch = useDispatch();
    const tabActiveKey = useTypedSelector((state) => state.menu.tabActiveKey);

    const [query, setQuery] = useState("");
    const { searchStr, handleFiltrationChange } = useDelayedInputSearch(query, setQuery);

    useEffect(() => {
        if (onSetSearchStr) {
            onSetSearchStr(searchStr);
        }
    }, [searchStr]);

    const handleChangeValue = (v: string) => {
        dispatch(SetDictionaryTabActiveKey(v));
    };

    const handleAdd = useCallback(() => {
        if (onSetIsModalVisible) {
            onSetIsModalVisible(true);
        }
    }, [onSetIsModalVisible]);

    return (
        <Row className={classes.wrapper}>
            <Col>
                <Input
                    className={classes.input}
                    placeholder="Поиск"
                    onChange={handleFiltrationChange}
                    suffix={<SearchOutlined className={classes.suffix} />}
                />
            </Col>
            <Col>
                <Select
                    showSearch
                    optionFilterProp="children"
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
                <Col className={classes.endedColWrapper}>
                    <Button customType={"regular"} onClick={handleAdd} icon={<PlusOutlined />}>
                        Добавить
                    </Button>
                </Col>
            )}
        </Row>
    );
};
export default memo(SearchingRow);
