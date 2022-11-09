import { Form, message } from "antd";
import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { ColumnDefinition } from "tabulator-tables";

import { AuthContext } from "context/AuthContextProvider";
import { companiesColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ICompanyCreateViewModel, ICompanyViewModel, ICompanyTreeNodeModel } from "interfaces";
import { createTableViaTabulator } from "services/tabulator";
import { CompanyDirectoryModal } from "./modal";
import { DataNode } from "antd/es/tree";
import { ITable } from "../Tables/ITable";
import SearchingRow from "../Tables/SearchingRow";
import editIcon from "assets/svg/editIcon.svg";
import addIcon from "assets/svg/addIcon.svg";

export type DataNodeItem = DataNode & ICompanyTreeNodeModel & { children: DataNodeItem[] };

export const CompanyTreeView: FC<ITable> = ({ selectionItems }) => {
    const authContext = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Tabulator.RowComponent>();
    const [form] = Form.useForm<ICompanyCreateViewModel>();
    const [editForm] = Form.useForm<ICompanyViewModel>();
    const [table, setTable] = useState<Tabulator>();

    const [searchStr, setSearchStr] = useState("");

    const onSetSearchStr = useCallback((v: string) => {
        setSearchStr(v);
    }, []);

    useEffect(() => {
        createCompamyNestedTable();
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

    const createCompamyNestedTable = () => {
        let url = `company/tree`;
        actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                let actionsCell: ColumnDefinition = {
                    title: "",
                    field: "id",
                    headerSort: false,
                    formatter: nestedTableActionsFormatter
                };

                const filteredData = data.filter((dataItem: any) => {
                    const tableDataStr =
                        (dataItem.nameKz || "") +
                        (dataItem.nameRu || "") +
                        (dataItem.nameEn || "") +
                        (dataItem.bin || "");
                    return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
                });

                setTable(
                    createTableViaTabulator(
                        "#companiesTable",
                        [...companiesColumns, actionsCell],
                        filteredData,
                        () => {}
                    )
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleAddCompany = async (data: ICompanyCreateViewModel) => {
        const company = selectedRow?.getData();
        data.parentId = company.companyId;
        let newChild = await createCompany(data);
        selectedRow?.addTreeChild(newChild);
        setSelectedRow(undefined);
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleUpdateCompany = async (data: any) => {
        let updatedData = await updateCompanyById(data);
        selectedRow?.update({ ...updatedData, _children: selectedRow.getData()._children });
        createCompamyNestedTable();
        setIsEditModalVisible(false);
        editForm.resetFields();
        setSelectedRow(undefined);
    };

    const updateCompanyById = (data: ICompanyViewModel) => {
        let url = `company`;
        return actionMethodResultSync(
            "DICTIONARY",
            url,
            "put",
            getRequestHeader(authContext.token),
            data
        )
            .then((data) => {
                message.success("Успешно обновлено");
                return data;
            })
            .catch(() => {
                message.error("Ошибка");
                return {};
            });
    };

    const createCompany = (data: ICompanyCreateViewModel) => {
        let url = `company`;
        return actionMethodResultSync(
            "DICTIONARY",
            url,
            "post",
            getRequestHeader(authContext.token),
            data
        )
            .then((data) => {
                message.success("Успешно создано");
                return data;
            })
            .catch((err) => {
                console.log(err);
                message.error("Ошибка");
                return [];
            });
    };

    const getCompanyById = (id: number) => {
        let url = `company/${id}`;
        return actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return {};
            });
    };

    const onEdit = async (row: Tabulator.RowComponent) => {
        console.log("edit");
        const company = row.getData();
        const data = await getCompanyById(company.companyId);
        editForm.setFieldsValue(data);
        setIsEditModalVisible(true);
    };

    const onAdd = (row: Tabulator.RowComponent) => {
        setSelectedRow(row);
        setIsModalVisible(true);
    };

    return (
        <>
            <CompanyDirectoryModal
                okText="Создать"
                title="Новая компания"
                onFinish={handleAddCompany}
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                form={form}
            />
            <CompanyDirectoryModal
                okText="Сохранить"
                title="Изменить данные"
                onFinish={handleUpdateCompany}
                isVisible={isEditModalVisible}
                setIsVisible={setIsEditModalVisible}
                form={editForm}
            />
            <SearchingRow selectionItems={selectionItems} onSetSearchStr={onSetSearchStr} />
            <div id="companiesTable" />
        </>
    );
};
