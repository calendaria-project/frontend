import { Form, message } from "antd";
import React, { FC, useCallback, useContext, useEffect, useState, Suspense } from "react";
import { ColumnDefinition } from "tabulator-tables";

import { AuthContext } from "context/AuthContextProvider";
import { companiesColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ICompanyCreateViewModel, ICompanyViewModel, ICompanyTreeNodeModel } from "interfaces";
import { createTableViaTabulator } from "services/tabulator";
import { DataNode } from "antd/es/tree";
import { ITable } from "../TableRenderer/ITable";
import SearchingRow from "../TableRenderer/SearchingRow";
import editIcon from "assets/svg/editIcon.svg";
import addIcon from "assets/svg/addIcon.svg";

const CompanyDirectoryModal = React.lazy(() => import("./modal"));

export type DataNodeItem = DataNode & ICompanyTreeNodeModel & { children: DataNodeItem[] };

export const CompanyTreeView: FC<ITable> = ({ selectionItems }) => {
    const authContext = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Tabulator.RowComponent>();
    const [form] = Form.useForm<ICompanyCreateViewModel>();
    const [editForm] = Form.useForm<ICompanyViewModel>();
    const [table, setTable] = useState<Tabulator>();
    const [tableData, setTableData] = useState<any>([]);

    const [companyData, setCompanyData] = useState<ICompanyViewModel>({} as ICompanyViewModel);

    const [searchStr, setSearchStr] = useState("");

    const onSetSearchStr = useCallback((v: string) => {
        setSearchStr(v);
    }, []);

    useEffect(() => {
        createCompamyNestedTable();
    }, []);

    useEffect(() => {
        const filteredTableData = tableData.filter((dataItem: any) => {
            const tableDataStr =
                (dataItem.nameKz || "") +
                (dataItem.nameRu || "") +
                (dataItem.nameEn || "") +
                (dataItem.bin || "");
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

                setTableData(data);

                setTable(
                    createTableViaTabulator(
                        "#companiesTable",
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

    const handleAddCompany = async (data: ICompanyCreateViewModel) => {
        console.log("handleAddCompany", data);
        const reformattedCompany = (company: any) => ({
            ...company,
            nameRu: `${company.companyType.nameRu} ${company.nameRu}`,
            nameKz: `${company.companyType.nameKz} ${company.nameKz}`,
            nameEn: `${company.companyType.nameEn || ""} ${company.nameEn || ""}`
        });

        if (selectedRow) {
            const company = selectedRow?.getData();
            data.parentId = company.companyId;
            const newChild: ICompanyViewModel = await createCompany(data);
            selectedRow?.addTreeChild(reformattedCompany(newChild));
            setSelectedRow(undefined);
        } else {
            const newCompany: ICompanyViewModel = await createCompany(data);
            table?.addData(reformattedCompany(newCompany));
            table?.redraw(true);
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleUpdateCompany = async (data: any) => {
        console.log("handleUpdateCompany", data);
        let updatedData = await updateCompanyById(data);
        selectedRow?.update({ ...updatedData, _children: selectedRow.getData()._children });
        createCompamyNestedTable();
        setIsEditModalVisible(false);
        setSelectedRow(undefined);
        editForm.resetFields();
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
        setCompanyData(data);
        console.log("onEdit getCompanyById data:", data);
        editForm.setFieldsValue(data);
        setIsEditModalVisible(true);
    };

    const onAdd = (row: Tabulator.RowComponent) => {
        setSelectedRow(row);
        setIsModalVisible(true);
    };

    return (
        <>
            <SearchingRow
                selectionItems={selectionItems}
                onSetSearchStr={onSetSearchStr}
                onSetIsModalVisible={setIsModalVisible}
            />
            <div id="companiesTable" />
            <Suspense>
                <CompanyDirectoryModal
                    okText="Создать"
                    title="Новая компания"
                    onFinish={handleAddCompany}
                    isVisible={isModalVisible}
                    setIsVisible={setIsModalVisible}
                    form={form}
                />
            </Suspense>
            <Suspense>
                <CompanyDirectoryModal
                    okText="Сохранить"
                    title="Изменить данные"
                    onFinish={handleUpdateCompany}
                    isVisible={isEditModalVisible}
                    setIsVisible={setIsEditModalVisible}
                    form={editForm}
                    companyData={companyData}
                />
            </Suspense>
        </>
    );
};
