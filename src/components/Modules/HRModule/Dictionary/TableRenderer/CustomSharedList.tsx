import React, { FC, useCallback, useContext, useEffect, useState, Suspense } from "react";
import { Button, Form, Input, message, Table } from "antd";

import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "http/actionMethodResult";
import { getRequestHeader } from "http/common";
import { ITable } from "./ITable";
import SearchingRow from "./SearchingRow";

import SaveIcon from "assets/svgComponents/SaveIcon";
import CancelIcon from "assets/svgComponents/CancelIcon";
import EditIcon from "assets/svgComponents/EditIcon";
import { ITheme } from "styles/theme/interface";

const SharedModal = React.lazy(() => import("./SharedModal"));

import { useTheme } from "react-jss";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "text";
    record: any;
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

interface ICustomSharedList extends ITable {
    modalTitle: string;
    id: string;
    url: string;
}

const CustomSharedList: FC<ICustomSharedList> = ({ selectionItems, modalTitle, id, url }) => {
    const authContext = useContext(AuthContext);

    const [data, setData] = useState<any[]>([]);
    const [copiedData, setCopiedData] = useState<any[]>([]);

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

    const isEditing = (record: any) => record[id] === editingKey;

    const edit = (record: Partial<any>) => {
        // console.log("record in edit", record);
        form.setFieldsValue({ code: "", nameKz: "", nameRu: "", nameEn: "", ...record });
        setEditingKey(record[id] || -1);
    };

    const save = async (record: any) => {
        try {
            // console.log("record in save", record);
            const row = (await form.validateFields()) as any;

            const newData = [...data];
            const index = newData.findIndex((item) => record[id] === item[id]);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                actionMethodResultSync(
                    "DICTIONARY",
                    url,
                    "put",
                    getRequestHeader(authContext.token),
                    newData[index]
                ).then(() => {
                    setData(newData);
                    setEditingKey(-1);
                    message.success("Успешно отредактировано");
                });
            } else {
                actionMethodResultSync(
                    "DICTIONARY",
                    url,
                    "post",
                    getRequestHeader(authContext.token),
                    record
                ).then((res) => {
                    newData.push({ ...record, [id]: res[id] });
                    setData(newData);
                    setIsModalVisible(false);
                    message.success("Успешно добавлено");
                });
            }
        } catch (errInfo) {
            message.error("Ошибка!");
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
            render: (_: any, record: any) => {
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
            onCell: (record: any) => ({
                record,
                inputType: "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });

    useEffect(() => {
        actionMethodResultSync("DICTIONARY", url, "get", getRequestHeader(authContext.token)).then(
            (res) => {
                const data = res.content;
                setCopiedData(data);
                setData(data);
            }
        );
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
                rowKey={id} //prop
                rowClassName="editable-row"
                pagination={{
                    onChange: () => setEditingKey(-1),
                    pageSize: 7,
                    position: ["bottomCenter"]
                }}
            />
            <Suspense>
                <SharedModal
                    okText="Создать"
                    title={modalTitle}
                    onFinish={save}
                    isVisible={isModalVisible}
                    setIsVisible={setIsModalVisible}
                    form={form}
                />
            </Suspense>
        </Form>
    );
};

export default CustomSharedList;
