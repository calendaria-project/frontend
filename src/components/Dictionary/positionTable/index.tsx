import { FC, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Table } from "antd";

import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { IPositionViewModel } from "interfaces";
import { PositionDirectoryModal } from "./modal";
import "./styles.scss";

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

const PositionList: FC = () => {
    const [data, setData] = useState<IPositionViewModel[]>([]);
    const authContext = useContext(AuthContext);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const isEditing = (record: IPositionViewModel) => record.positionId === editingKey;

    const edit = (record: Partial<IPositionViewModel>) => {
        form.setFieldsValue({ code: "", nameKz: "", nameRu: "", nameEn: "", ...record });
        setEditingKey(record.positionId || -1);
    };

    const save = async (record: IPositionViewModel) => {
        try {
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
                    "position",
                    "post",
                    getRequestHeader(authContext.token),
                    record
                ).then(() => {
                    newData.push({ ...record, positionId: 0 });
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
                return editable ? (
                    <>
                        <Button
                            style={{ background: "#1890ff", color: "#fff", marginRight: 8 }}
                            onClick={() => save(record)}
                        >
                            Сохранить
                        </Button>
                        <Button style={{ background: "#e6d87e" }} onClick={() => setEditingKey(-1)}>
                            Отмена
                        </Button>
                    </>
                ) : (
                    <Button
                        style={{ background: "#e6d87e" }}
                        disabled={editingKey !== -1}
                        onClick={() => edit(record)}
                    >
                        Изменить
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
        actionMethodResultSync("position", "get", getRequestHeader(authContext.token)).then(
            (res) => {
                setData(res.content);
            }
        );
    }, []);

    return (
        <Form form={form} component={false}>
            <Row gutter={24}>
                <Col span={4}>
                    <Button
                        style={{ background: "#1890ff", color: "#fff", marginBottom: 10 }}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Добавить
                    </Button>
                </Col>
            </Row>
            <Table
                components={{
                    body: {
                        cell: EditableCell
                    }
                }}
                bordered
                columns={mergedColumns}
                dataSource={data}
                rowKey="positionId"
                rowClassName="editable-row"
                pagination={{
                    onChange: () => setEditingKey(-1),
                    pageSize: 5,
                    position: ["bottomCenter"]
                }}
            />
            <PositionDirectoryModal
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
