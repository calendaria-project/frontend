import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, Input, Table } from "antd";

import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { IPositionViewModel } from "interfaces";
import { SharedModal } from "../SharedModal";
import { ITable } from "../ITable";
import SearchingRow from "../SearchingRow";

import SaveIcon from "assets/svgComponents/SaveIcon";
import CancelIcon from "assets/svgComponents/CancelIcon";
import EditIcon from "assets/svgComponents/EditIcon";
import { ITheme } from "styles/theme/interface";

import { useTheme } from "react-jss";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "text";
    record: IPositionViewModel;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    // console.log("record in editable cell", record);
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: dataIndex !== "nameEn",
                            message: "Обязательное поле!"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const PositionList: FC<ITable> = ({ selectionItems }) => {
    const authContext = useContext(AuthContext);

    const [data, setData] = useState<IPositionViewModel[]>([]);
    const [copiedData, setCopiedData] = useState<IPositionViewModel[]>([]);

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const theme = useTheme<ITheme>();

    const onSetIsModalVisible = useCallback((bool: boolean) => {
        setIsModalVisible(bool);
    }, []);

    const [searchStr, setSearchStr] = useState("");

    const onSetSearchStr = useCallback((v: string) => {
        setSearchStr(v);
    }, []);

    const isEditing = (record: IPositionViewModel) => record.positionId === editingKey;

    const edit = (record: Partial<IPositionViewModel>) => {
        // console.log("record in edit", record);
        form.setFieldsValue({ code: "", nameKz: "", nameRu: "", nameEn: "", ...record });
        setEditingKey(record.positionId || -1);
    };

    const save = async (record: IPositionViewModel) => {
        try {
            // console.log("record in save", record);
            const row = (await form.validateFields()) as IPositionViewModel;

            const newData = [...data];
            const index = newData.findIndex((item) => record.positionId === item.positionId);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                actionMethodResultSync(
                    "DICTIONARY",
                    "position",
                    "put",
                    getRequestHeader(authContext.token),
                    newData[index]
                ).then(() => {
                    setData(newData);
                    setEditingKey(-1);
                });
            } else {
                actionMethodResultSync(
                    "DICTIONARY",
                    "position",
                    "post",
                    getRequestHeader(authContext.token),
                    record
                ).then((res) => {
                    newData.push({ ...record, positionId: res.positionId });
                    setData(newData);
                    setIsModalVisible(false);
                });
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const columns = [
        {
            title: "Код",
            dataIndex: "code",
            width: 200,
            editable: true
        },
        {
            title: "Название на Казахском",
            dataIndex: "nameKz",
            width: 250,
            editable: true
        },
        {
            title: "Название на Русском",
            dataIndex: "nameRu",
            width: 250,
            editable: true
        },
        {
            title: "Название на Английском",
            dataIndex: "nameEn",
            width: 250,
            editable: true
        },
        {
            title: "Действие",
            dataIndex: "operation",
            width: 300,
            render: (_: any, record: IPositionViewModel) => {
                const editable = isEditing(record);
                const disabled = editingKey !== -1;
                return editable ? (
                    <>
                        <Button type={"link"} onClick={() => save(record)}>
                            <SaveIcon color={theme.color.successful as string} />
                        </Button>
                        <Button type={"link"} onClick={() => setEditingKey(-1)}>
                            <CancelIcon color={theme.color.regular as string} />
                        </Button>
                    </>
                ) : (
                    <Button type={"link"} disabled={disabled} onClick={() => edit(record)}>
                        <EditIcon
                            color={
                                disabled
                                    ? (theme.color.disabled as string)
                                    : (theme.color.regular as string)
                            }
                        />
                    </Button>
                );
            }
        }
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: IPositionViewModel) => ({
                record,
                inputType: "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });

    useEffect(() => {
        actionMethodResultSync(
            "DICTIONARY",
            "position",
            "get",
            getRequestHeader(authContext.token)
        ).then((res) => {
            const data = res.content;
            setCopiedData(data);
            setData(data);
        });
    }, []);

    useEffect(() => {
        const filteredData = copiedData.filter((dataItem) => {
            const tableDataStr =
                (dataItem.nameKz || "") +
                (dataItem.nameRu || "") +
                (dataItem.nameEn || "") +
                (dataItem.code || "");
            return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
        });

        setData(filteredData);
    }, [searchStr]);

    return (
        <Form form={form} component={false}>
            <SearchingRow
                selectionItems={selectionItems}
                onSetSearchStr={onSetSearchStr}
                onSetIsModalVisible={onSetIsModalVisible}
            />
            <Table
                components={{
                    body: {
                        cell: EditableCell
                    }
                }}
                bordered
                columns={mergedColumns}
                dataSource={data}
                rowKey="positionId" //prop
                rowClassName="editable-row"
                pagination={{
                    onChange: () => setEditingKey(-1),
                    pageSize: 7,
                    position: ["bottomCenter"]
                }}
            />
            <SharedModal
                okText="Создать"
                title="Новая позиция"
                onFinish={save}
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                form={form}
            />
        </Form>
    );
};

export default PositionList;
