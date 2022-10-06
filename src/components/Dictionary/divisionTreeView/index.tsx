import { Button, Form, message, Select } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useContext, useEffect, useState } from "react";
import { ColumnDefinition } from "tabulator-tables";

import { AuthContext } from "context/AuthContextProvider";
import { divisionsColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ICompanyViewModel, IDivisionCreateViewModel, IDivisionTreeNodeViewModel, IDivisionViewModel } from "interfaces";
import { createTableViaTabulator } from "services/tabulator";
import { DivisionDirectoryModal } from "./modal";
import './styles.scss';

const { Option } = Select

export type DataNodeItem =
    DataNode &
    IDivisionTreeNodeViewModel &
    { children: DataNodeItem[] }

export const DivisionTreeView: React.FC = () => {
    const authContext = useContext(AuthContext);
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [selectedDivisionRow, setSelectedDivisionRow] = useState<Tabulator.RowComponent>()
    const [form] = Form.useForm<IDivisionCreateViewModel>();
    const [editForm] = Form.useForm<IDivisionViewModel>();
    const [table, setTable] = useState<Tabulator>()
    const [companies, setCompanies] = useState<ICompanyViewModel[]>([])
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(undefined)

    useEffect(() => {
        initDivisionsTabulator()
    }, [selectedCompanyId])

    useEffect(() => {
        getCompanies()
    }, [])

    const getCompanies = () => {
        actionMethodResultSync("company?page=0&size=100&sortingRule=companyId%3AASC", "get", getRequestHeader(authContext.token))
            .then(data => setCompanies(data.content))
    }

    const nestedTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        let editBtn = document.createElement("button")
        editBtn.textContent = "Изменить"
        editBtn.setAttribute("class", "editBtn ant-btn ant-btn-default")
        editBtn.addEventListener("click", () => onEdit(cell.getRow()))

        let addBtn = document.createElement("button")
        addBtn.textContent = "Добавить"
        addBtn.setAttribute("class", "addBtn ant-btn ant-btn-primary")
        addBtn.addEventListener("click", () => onAdd(cell.getRow()))

        let wrap = document.createElement("div")
        wrap.setAttribute('class', 'actionsWrap')

        wrap.appendChild(editBtn)
        wrap.appendChild(addBtn)
        return wrap
    }

    const initDivisionsTabulator = async () => {
        const data = await getDivisionsByParentId(0)
        let actionsCell: ColumnDefinition = {
            title: '',
            field: 'id',
            headerSort: false,
            formatter: nestedTableActionsFormatter
        }
        setTable(
            createTableViaTabulator("#divisionsTable", 10, "local", "", [...divisionsColumns, actionsCell], data, () => { })
        )
    }

    const hanldeAddDivision = async (data: IDivisionCreateViewModel) => {
        if (selectedDivisionRow) {
            data.parentId = selectedDivisionRow?.getData().divisionId
        }
        const newChild = await createDivision(data)
        if (selectedDivisionRow) {
            selectedDivisionRow?.addTreeChild(newChild)
        } else {
            table?.addData(newChild)
        }
        setSelectedDivisionRow(undefined)
        setIsModalVisible(false)
        form.resetFields()
    }

    const hanldeUpdateDivision = async (data: any) => {
        const division = await updateDivisionById(data)
        selectedDivisionRow?.update({ ...division, _children: selectedDivisionRow.getData()._children })
        setSelectedDivisionRow(undefined)
        setIsEditModalVisible(false)
        initDivisionsTabulator()
        editForm.resetFields()
    }

    const getDivisionsByParentId = (id: number) => {
        let url = `division/tree?companyId=${selectedCompanyId || 0}`
        return actionMethodResultSync(url, "get", getRequestHeader(authContext.token))
            .then((data) => data)
            .catch(err => {
                console.log(err)
                message.error("Ошибка")
                return err
            })
    }

    const updateDivisionById = (data: IDivisionViewModel) => {
        let url = `division`
        data.companyId = selectedCompanyId || 0
        return actionMethodResultSync(url, "put", getRequestHeader(authContext.token), data)
            .then((data) => {
                message.success("Успешно обновлено")
                return data
            })
            .catch(err => {
                message.error("Ошибка")
                return err
            })
    }

    const createDivision = (data: IDivisionCreateViewModel) => {
        let url = `division`
        data.companyId = selectedCompanyId || 0
        return actionMethodResultSync(url, "post", getRequestHeader(authContext.token), data)
            .then((data) => {
                message.success("Успешно создано")
                return data
            })
            .catch(err => {
                console.log(err)
                message.error("Ошибка")
                return err
            })
    }

    const getDivisionById = (id: number) => {
        let url = `division/${id}`
        return actionMethodResultSync(url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                return data
            })
            .catch(err => {
                console.log(err)
                return {}
            })
    }

    const onEdit = async (row: any) => {
        console.log('edit');
        const division = row.getData()
        const data = await getDivisionById(division.divisionId)
        editForm.setFieldsValue(data)
        setIsEditModalVisible(true)
    };

    const onAdd = (row: any) => {
        setSelectedDivisionRow(row)
        setIsModalVisible(true)
    };

    return (
        <div>
            <div>
                <Select
                    placeholder="Выберите компанию"
                    style={{ width: 250 }}
                    value={selectedCompanyId || null}
                    onChange={(val) => setSelectedCompanyId(+val)}
                >
                    {
                        companies.map((el, i) => (
                            <Option key={i} value={el.companyId}>{el.nameRu}</Option>
                        ))
                    }
                </Select>
                <Button disabled={!selectedCompanyId} onClick={() => onAdd(undefined)} style={{ marginLeft: "10px" }} type='primary'>Добавить</Button>
            </div>
            <DivisionDirectoryModal
                okText="Создать"
                title="Новое подразделение"
                onFinish={hanldeAddDivision}
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                form={form}
            />
            <DivisionDirectoryModal
                okText="Сохранить"
                title="Изменение данные"
                onFinish={hanldeUpdateDivision}
                isVisible={isEditModalVisible}
                setIsVisible={setIsEditModalVisible}
                form={editForm}
            />
            <div id='divisionsTable' ></div>
        </div>
    )
}