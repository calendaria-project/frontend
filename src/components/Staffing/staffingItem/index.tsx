import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Col, Form, message, PageHeader, Row } from "antd";
import { ColumnDefinition } from "tabulator-tables";

import { AuthContext } from "context/AuthContextProvider";
import { staffingItemColumns } from "data/columns";
import { StaffingNodeTypesEnum } from "data/enums";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { IPositionViewModel, IStaffingItemCreateModel, IStaffingItemViewModel } from "interfaces";
import { createTableViaTabulator } from "services/tabulator";
import { StaffingItemModal } from "./modal";

const StaffingItem: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Tabulator.RowComponent>();
    const [form] = Form.useForm<IStaffingItemCreateModel>();
    const [editForm] = Form.useForm<IStaffingItemViewModel>();
    const [table, setTable] = useState<Tabulator>();
    const { staffingId } = useParams();
    const [positions, setPositions] = useState<IPositionViewModel[]>([]);

    useEffect(() => {
        createStaffingItemNestedTable();
        getPositions();
    }, []);

    const nestedTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        const data: any = cell.getData();
        let editBtn = document.createElement("button");
        editBtn.textContent = "Изменить";
        editBtn.setAttribute("class", "editBtn ant-btn ant-btn-secondary");
        editBtn.addEventListener("click", () => onEdit(cell.getRow()));

        let addBtn = document.createElement("button");
        addBtn.textContent = "Добавить";
        addBtn.setAttribute("class", "addBtn ant-btn ant-btn-primary");
        addBtn.addEventListener("click", () => onAdd(cell.getRow()));

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.setAttribute("class", "ant-btn ant-btn-primary ant-btn-dangerous");
        deleteBtn.addEventListener("click", () => onDelete(cell.getRow()));

        let wrap = document.createElement("div");
        wrap.setAttribute("class", "actionsWrap");

        if (data.nodeType === StaffingNodeTypesEnum.DIVISION) {
            wrap.appendChild(addBtn);
        }
        if (data.nodeType === StaffingNodeTypesEnum.STAFFING_ITEM) {
            wrap.appendChild(editBtn);
            wrap.appendChild(deleteBtn);
        }
        return wrap;
    };

    const createStaffingItemNestedTable = () => {
        let url = `staffing-items/tree?staffingId=${staffingId}`;
        actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                let actionsCell: ColumnDefinition = {
                    title: "",
                    field: "id",
                    headerSort: false,
                    formatter: nestedTableActionsFormatter
                };
                setTable(
                    createTableViaTabulator(
                        "#staffingItemsTable",
                        [...staffingItemColumns, actionsCell],
                        data,
                        () => {}
                    )
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const hanldeAddStaffingItem = async (data: IStaffingItemCreateModel) => {
        console.log(data);
        const staffingItem = selectedRow?.getData();
        data.staffingId = Number(staffingId) || 0;
        data.divisionId = staffingItem.id;
        let newChild = await createStaffingItem(data);
        selectedRow?.addTreeChild(newChild);
        setSelectedRow(undefined);
        setIsModalVisible(false);
        form.resetFields();
    };

    const hanldeUpdateStaffingItem = async (data: any) => {
        console.log(data);
        let updatedData = await updateStaffingById(data);
        selectedRow?.update({ ...updatedData, _children: selectedRow.getData()._children });
        createStaffingItemNestedTable();
        setIsEditModalVisible(false);
        editForm.resetFields();
        setSelectedRow(undefined);
    };

    const updateStaffingById = (data: IStaffingItemViewModel) => {
        let url = `staffing-items`;
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
            .catch((err) => {
                console.log(err);
                message.error("Ошибка");
                return {};
            });
    };

    const deleteStaffingById = (id: number) => {
        let url = `staffing-items/${id}`;
        return actionMethodResultSync(
            "DICTIONARY",
            url,
            "delete",
            getRequestHeader(authContext.token)
        )
            .then((data) => {
                message.success("Успешно удалено");
                return data;
            })
            .catch((err) => {
                console.log(err);
                message.error("Ошибка");
                return {};
            });
    };

    const createStaffingItem = (data: IStaffingItemCreateModel) => {
        let url = `staffing-items`;
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

    const getStaffingItemById = (id: number) => {
        let url = `staffing-items/${id}`;
        return actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                return data;
            })
            .catch((err) => {
                console.log(err);
                return {};
            });
    };

    const getPositions = () => {
        let url = `position?page=0&size=1000`;
        actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token))
            .then((data) => {
                setPositions(data.content);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onEdit = async (row: Tabulator.RowComponent) => {
        console.log("edit");
        const staffingItem = row.getData();
        const data = await getStaffingItemById(staffingItem.id);
        editForm.setFieldsValue(data);
        setIsEditModalVisible(true);
    };

    const onAdd = (row: Tabulator.RowComponent) => {
        setSelectedRow(row);
        setIsModalVisible(true);
    };

    const onDelete = async (row: Tabulator.RowComponent) => {
        const data = row.getData();
        await deleteStaffingById(data.id);
        createStaffingItemNestedTable();
    };

    return (
        <Row style={{ marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Col span={24}>
                <PageHeader
                    className="site-page-header"
                    onBack={() => navigate("/staffing")}
                    title="Штатные расписания"
                    subTitle="Штатные единицы"
                />
            </Col>
            <Col span={24}>
                <StaffingItemModal
                    okText="Создать"
                    title="Создание штатной единицы"
                    onFinish={hanldeAddStaffingItem}
                    isVisible={isModalVisible}
                    setIsVisible={setIsModalVisible}
                    form={form}
                    positions={positions}
                />
                <StaffingItemModal
                    okText="Сохранить"
                    title="Редактирование штатной единицы"
                    onFinish={hanldeUpdateStaffingItem}
                    isVisible={isEditModalVisible}
                    setIsVisible={setIsEditModalVisible}
                    form={editForm}
                    positions={positions}
                />
                <div id="staffingItemsTable" />
            </Col>
        </Row>
    );
};

export default StaffingItem;
