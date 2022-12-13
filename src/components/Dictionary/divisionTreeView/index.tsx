import { Form, message, Select } from "antd";
import type { DataNode } from "antd/es/tree";
import React, { FC, useCallback, useContext, useEffect, useState, Suspense } from "react";
import { ColumnDefinition } from "tabulator-tables";

import { AuthContext } from "context/AuthContextProvider";
import { divisionsColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import {
    IDivisionCreateViewModel,
    IDivisionTreeNodeViewModel,
    IDivisionViewModel
} from "interfaces";
import { createTableViaTabulator } from "services/tabulator";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import { ITable } from "../Tables/ITable";
import SearchingRow from "../Tables/SearchingRow";

import editIcon from "assets/svg/editIcon.svg";
import addIcon from "assets/svg/addIcon.svg";

import useStyles from "./styles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import Button from "ui/Button";
import { PlusOutlined } from "@ant-design/icons";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

const DivisionDirectoryModal = React.lazy(() => import("./modal"));

const { Option } = Select;

export type DataNodeItem = DataNode & IDivisionTreeNodeViewModel & { children: DataNodeItem[] };

export const DivisionTreeView: FC<ITable> = ({ selectionItems }) => {
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedDivisionRow, setSelectedDivisionRow] = useState<Tabulator.RowComponent>();
    const [form] = Form.useForm<IDivisionCreateViewModel>();
    const [editForm] = Form.useForm<IDivisionViewModel>();
    const [table, setTable] = useState<Tabulator>();
    const [tableData, setTableData] = useState<any>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined);

    const { companies } = useSimpleHttpFunctions();

    const [searchStr, setSearchStr] = useState("");

    const onSetSearchStr = useCallback((v: string) => {
        setSearchStr(v);
    }, []);

    useEffect(() => {
        initDivisionsTabulator();
    }, [selectedCompanyId]);

    useEffect(() => {
        const filteredTableData = tableData.filter((dataItem: any) => {
            const tableDataStr =
                (dataItem.nameKz || "") +
                (dataItem.nameRu || "") +
                (dataItem.nameEn || "") +
                (dataItem.code || "");
            return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
        });

        table?.replaceData(filteredTableData);
        table?.redraw(true);
    }, [searchStr]);

    const nestedTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        let editBtnIcon = document.createElement("img");
        editBtnIcon.setAttribute("src", editIcon);
        editBtnIcon.addEventListener("click", () => onEdit(cell.getRow()));

        let addBtnIcon = document.createElement("img");
        addBtnIcon.setAttribute("src", addIcon);
        addBtnIcon.setAttribute("style", "margin-left: 28px");
        addBtnIcon.addEventListener("click", () => onAdd(cell.getRow()));

        let wrap = document.createElement("div");
        wrap.setAttribute("class", "actionsWrap");

        wrap.appendChild(editBtnIcon);
        wrap.appendChild(addBtnIcon);
        return wrap;
    };

    const initDivisionsTabulator = async () => {
        const data = await getDivisionsByParentId(0);
        let actionsCell: ColumnDefinition = {
            title: "",
            field: "id",
            headerSort: false,
            formatter: nestedTableActionsFormatter
        };

        setTableData(data);

        setTable(
            createTableViaTabulator(
                "#divisionsTable",
                [...divisionsColumns, actionsCell],
                data,
                () => {}
            )
        );
    };

    const hanldeAddDivision = (data: IDivisionCreateViewModel) => {
        if (selectedDivisionRow) {
            data.parentId = selectedDivisionRow?.getData().divisionId;
        }
        createDivision(removeEmptyValuesFromAnyLevelObject(data));
        setSelectedDivisionRow(undefined);
        setIsModalVisible(false);
        form.resetFields();
    };

    const hanldeUpdateDivision = async (data: any) => {
        const division = await updateDivisionById(removeEmptyValuesFromAnyLevelObject(data));
        selectedDivisionRow?.update({
            ...division,
            _children: selectedDivisionRow.getData()._children
        });
        setSelectedDivisionRow(undefined);
        setIsEditModalVisible(false);
        initDivisionsTabulator();
        editForm.resetFields();
    };

    const getDivisionsByParentId = (id: number) => {
        let url = `division/tree?companyId=${selectedCompanyId || 0}`;
        return actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => data)
            .catch((err) => {
                console.log(err);
                message.error("Ошибка");
                return err;
            });
    };

    const updateDivisionById = (data: IDivisionViewModel) => {
        data.companyId = selectedCompanyId || 0;
        return actionMethodResultSync(
            "DICTIONARY",
            "division",
            "put",
            getRequestHeader(authContext.token),
            data
        )
            .then((data) => {
                message.success("Успешно обновлено");
                return data;
            })
            .catch((err) => {
                message.error("Ошибка");
                return err;
            });
    };

    const createDivision = (data: IDivisionCreateViewModel) => {
        data.companyId = selectedCompanyId || 0;
        actionMethodResultSync(
            "DICTIONARY",
            "division",
            "post",
            getRequestHeader(authContext.token),
            data
        )
            .then((data) => {
                message.success("Успешно создано");
                if (selectedDivisionRow) {
                    selectedDivisionRow?.addTreeChild(data);
                } else {
                    table?.addData(data);
                }
            })
            .catch((err) => {
                console.log(err);
                message.error("Ошибка");
                return err;
            });
    };

    const getDivisionById = (id: number) => {
        let url = `division/${id}`;
        return actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return {};
            });
    };

    const onEdit = async (row: any) => {
        const division = row.getData();
        const data = await getDivisionById(division.divisionId);
        editForm.setFieldsValue(data);
        setIsEditModalVisible(true);
    };

    const onAdd = (row: any) => {
        setSelectedDivisionRow(row);
        setIsModalVisible(true);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={classes.selectionWrapper}>
                    <SearchingRow selectionItems={selectionItems} onSetSearchStr={onSetSearchStr} />
                    <Select
                        placeholder="Выберите компанию"
                        className={classes.select}
                        value={selectedCompanyId || null}
                        onChange={(val) => setSelectedCompanyId(+val)}
                    >
                        {companies.map((el, i) => (
                            <Option key={i} value={el.companyId}>
                                {el.nameRu}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Button
                        className={classes.button}
                        disabled={!selectedCompanyId}
                        onClick={() => onAdd(undefined)}
                        icon={<PlusOutlined />}
                        customType={"regular"}
                    >
                        Добавить
                    </Button>
                </div>
            </div>
            <Suspense>
                <DivisionDirectoryModal
                    okText="Создать"
                    title="Новое подразделение"
                    onFinish={hanldeAddDivision}
                    isVisible={isModalVisible}
                    setIsVisible={setIsModalVisible}
                    form={form}
                />
            </Suspense>
            <Suspense>
                <DivisionDirectoryModal
                    okText="Сохранить"
                    title="Изменение данные"
                    onFinish={hanldeUpdateDivision}
                    isVisible={isEditModalVisible}
                    setIsVisible={setIsEditModalVisible}
                    form={editForm}
                />
            </Suspense>
            <div id="divisionsTable" />
        </div>
    );
};
