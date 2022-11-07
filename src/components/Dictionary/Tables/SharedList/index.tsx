import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { Button, Form, Input, Table } from "antd";

import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ISimpleDictionaryViewModel } from "interfaces";
import { SharedModal } from "../SharedModal";
import { ITable } from "../ITable";
import SearchingRow from "../SearchingRow";
import SaveIcon from "assets/svgComponents/SaveIcon";
import CancelIcon from "assets/svgComponents/CancelIcon";
import EditIcon from "assets/svgComponents/EditIcon";
import RemoveIcon from "assets/svgComponents/RemoveIcon";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "text";
    record: ISimpleDictionaryViewModel;
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

interface ISharedList extends ITable {
    dictionaryCode: string;
    modalTitle: string;
}

const SharedList: FC<ISharedList> = ({ dictionaryCode, modalTitle, selectionItems }) => {
    const [data, setData] = useState<ISimpleDictionaryViewModel[]>([]);
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onSetIsModalVisible = useCallback((bool: boolean) => {
        setIsModalVisible(bool);
    }, []);

    const isEditing = (record: ISimpleDictionaryViewModel) => record.id === editingKey;

    const edit = (record: Partial<ISimpleDictionaryViewModel>) => {
        form.setFieldsValue({ code: "", nameKz: "", nameRu: "", nameEn: "", ...record });
        setEditingKey(record.id || -1);
    };

    const remove = (record: Partial<ISimpleDictionaryViewModel>) => {
        const newData = [...data];
        actionMethodResultSync(
            "DICTIONARY",
            `simple/${dictionaryCode}/item/${record.id}`,
            "delete",
            getRequestHeader(authContext.token)
        ).then(() => {
            setData(newData.filter((dataItem) => dataItem.id !== record.id));
            setEditingKey(-1);
        });
    };

    const save = async (record: ISimpleDictionaryViewModel) => {
        try {
            const row = (await form.validateFields()) as ISimpleDictionaryViewModel;

            const newData = [...data];
            const index = newData.findIndex((item) => record.id === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                actionMethodResultSync(
                    "DICTIONARY",
                    `simple/${dictionaryCode}/update`,
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
                    `simple/${dictionaryCode}/create`,
                    "post",
                    getRequestHeader(authContext.token),
                    record
                ).then((res) => {
                    newData.push({ ...record, id: res.id });
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
            render: (_: any, record: ISimpleDictionaryViewModel) => {
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
                    <>
                        <Button type={"link"} disabled={disabled} onClick={() => edit(record)}>
                            <EditIcon
                                color={
                                    disabled
                                        ? (theme.color.disabled as string)
                                        : (theme.color.regular as string)
                                }
                            />
                        </Button>
                        <Button type={"link"} disabled={disabled} onClick={() => remove(record)}>
                            <RemoveIcon
                                color={
                                    disabled
                                        ? (theme.color.disabled as string)
                                        : (theme.color.removing as string)
                                }
                            />
                        </Button>
                    </>
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
            onCell: (record: ISimpleDictionaryViewModel) => ({
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
            `simple/${dictionaryCode}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            setData(data);
        });
    }, []);

    return (
        <Form form={form} component={false}>
            <SearchingRow
                selectionItems={selectionItems}
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
                rowKey="id"
                rowClassName="editable-row"
                pagination={{
                    onChange: () => setEditingKey(-1),
                    pageSize: 5,
                    position: ["bottomCenter"]
                }}
            />
            <SharedModal
                okText="Создать"
                title={modalTitle}
                onFinish={save}
                isVisible={isModalVisible}
                setIsVisible={setIsModalVisible}
                form={form}
            />
        </Form>
    );
};

export default SharedList;
