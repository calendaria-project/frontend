import { Form, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ColumnDefinition } from "tabulator-tables";

import { AuthContext } from "context/AuthContextProvider";
import { companiesColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ICompanyCreateViewModel, ICompanyViewModel, ICompanyTreeNodeModel } from "interfaces";
import { createTableViaTabulator } from "services/tabulator";
import { CompanyDirectoryModal } from "./modal";
import "./styles.scss";
import { DataNode } from "antd/es/tree";

export type DataNodeItem = DataNode & ICompanyTreeNodeModel & { children: DataNodeItem[] };

export const CompanyTreeView: React.FC = ({}) => {
    const authContext = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Tabulator.RowComponent>();
    const [form] = Form.useForm<ICompanyCreateViewModel>();
    const [editForm] = Form.useForm<ICompanyViewModel>();
    const [table, setTable] = useState<Tabulator>();

    useEffect(() => {
        createCompamyNestedTable();
    }, []);

    const nestedTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        let editBtn = document.createElement("button");
        editBtn.textContent = "Изменить";
        editBtn.setAttribute("class", "editBtn ant-btn ant-btn-secondary");
        editBtn.addEventListener("click", () => onEdit(cell.getRow()));

        let addBtn = document.createElement("button");
        addBtn.textContent = "Добавить";
        addBtn.setAttribute("class", "addBtn ant-btn ant-btn-primary");
        addBtn.addEventListener("click", () => onAdd(cell.getRow()));

        let wrap = document.createElement("div");
        wrap.setAttribute("class", "actionsWrap");

        wrap.appendChild(editBtn);
        wrap.appendChild(addBtn);
        return wrap;
    };

    const createCompamyNestedTable = () => {
        let url = `company/tree`;
        actionMethodResultSync(url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                let actionsCell: ColumnDefinition = {
                    title: "",
                    field: "id",
                    headerSort: false,
                    formatter: nestedTableActionsFormatter
                };
                setTable(
                    createTableViaTabulator(
                        "#companiesTable",
                        10,
                        "local",
                        "",
                        [...companiesColumns, actionsCell],
                        data,
                        () => {}
                    )
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const hanldeAddCompany = async (data: ICompanyCreateViewModel) => {
        const company = selectedRow?.getData();
        data.parentId = company.companyId;
        let newChild = await createCompany(data);
        selectedRow?.addTreeChild(newChild);
        setSelectedRow(undefined);
        setIsModalVisible(false);
        form.resetFields();
    };

    const hanldeUpdateCompany = async (data: any) => {
        let updatedData = await updateCompanyById(data);
        selectedRow?.update({ ...updatedData, _children: selectedRow.getData()._children });
        createCompamyNestedTable();
        setIsEditModalVisible(false);
        editForm.resetFields();
        setSelectedRow(undefined);
    };

    const updateCompanyById = (data: ICompanyViewModel) => {
        let url = `company`;
        return actionMethodResultSync(url, "put", getRequestHeader(authContext.token), data)
            .then((data) => {
                message.success("Успешно обновлено");
                return data;
            })
            .catch((err) => {
                message.error("Ошибка");
                return {};
            });
    };

    const createCompany = (data: ICompanyCreateViewModel) => {
        let url = `company`;
        return actionMethodResultSync(url, "post", getRequestHeader(authContext.token), data)
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
        return actionMethodResultSync(url, "get", getRequestHeader(authContext.token))
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
                onFinish={hanldeAddCompany}
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                form={form}
            />
            <CompanyDirectoryModal
                okText="Сохранить"
                title="Изменение данные"
                onFinish={hanldeUpdateCompany}
                isVisible={isEditModalVisible}
                setIsVisible={setIsEditModalVisible}
                form={editForm}
            />
            <div id="companiesTable"></div>
        </>
    );
};
