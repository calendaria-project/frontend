import React, { FC, useCallback, useContext, useEffect, useState, Suspense } from "react";
import { Button, Form, Input, Table } from "antd";

import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ICompanyTypeViewModel } from "interfaces";
import { ITable } from "components/Shared/DictionaryTableRenderer/ITable";
import SearchingRow from "components/Shared/DictionaryTableRenderer/SearchingRow";
import SaveIcon from "assets/svgComponents/SaveIcon";
import CancelIcon from "assets/svgComponents/CancelIcon";
import EditIcon from "assets/svgComponents/EditIcon";
import RemoveIcon from "assets/svgComponents/RemoveIcon";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

const CompanyTypeModal = React.lazy(() => import("./modal"));

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: "text";
    record: ICompanyTypeViewModel;
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
                            required: !(dataIndex === "nameEn" || dataIndex === "longnameEn"),
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

const CompanyTypeList: FC<ITable> = ({ selectionItems }) => {
    const authContext = useContext(AuthContext);
    const theme = useTheme<ITheme>();
    //@ts-ignore
    const classes = useStyles(theme);

    const [data, setData] = useState<ICompanyTypeViewModel[]>([]);
    const [copiedData, setCopiedData] = useState<ICompanyTypeViewModel[]>([]);

    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const onSetIsModalVisible = useCallback((bool: boolean) => {
        setIsModalVisible(bool);
    }, []);

    const [searchStr, setSearchStr] = useState("");

    const onSetSearchStr = useCallback((v: string) => {
        setSearchStr(v);
    }, []);

    const isEditing = (record: ICompanyTypeViewModel) => record.companyTypeId === editingKey;

    const edit = (record: Partial<ICompanyTypeViewModel>) => {
        form.setFieldsValue({
            code: "",
            nameKz: "",
            nameRu: "",
            nameEn: "",
            longnameKz: "",
            longnameRu: "",
            longnameEn: "",
            ...record
        });
        setEditingKey(record.companyTypeId || -1);
    };

    const remove = (record: Partial<ICompanyTypeViewModel>) => {
        const newData = [...data];
        actionMethodResultSync(
            "DICTIONARY",
            `company-type/${record.companyTypeId}`,
            "delete",
            getRequestHeader(authContext.token)
        ).then(() => {
            setData(newData.filter((dataItem) => dataItem.companyTypeId !== record.companyTypeId));
            setEditingKey(-1);
        });
    };

    const save = async (record: ICompanyTypeViewModel) => {
        try {
            const row = (await form.validateFields()) as ICompanyTypeViewModel;

            const newData = [...data];
            const index = newData.findIndex((item) => record.companyTypeId === item.companyTypeId);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });
                actionMethodResultSync(
                    "DICTIONARY",
                    `company-type`,
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
                    `company-type`,
                    "post",
                    getRequestHeader(authContext.token),
                    record
                ).then((res) => {
                    newData.push({ ...record, companyTypeId: res.companyTypeId });
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
            editable: true
        },
        {
            title: "Наименование Каз.",
            dataIndex: "nameKz",
            editable: true
        },
        {
            title: "Наименование Рус.",
            dataIndex: "nameRu",
            editable: true
        },
        {
            title: "Название Анг.",
            dataIndex: "nameEn",
            editable: true
        },
        {
            title: "Полное Каз. наименование",
            dataIndex: "longnameKz",
            editable: true
        },
        {
            title: "Полное Рус. наименование",
            dataIndex: "longnameRu",
            editable: true
        },
        {
            title: "Полное Анг. наименование",
            dataIndex: "longnameEn",
            editable: true
        },
        {
            title: "Действие",
            dataIndex: "operation",
            render: (_: any, record: ICompanyTypeViewModel) => {
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
            onCell: (record: ICompanyTypeViewModel) => ({
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
            `company-type`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
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
                (dataItem.longnameKz || "") +
                (dataItem.longnameRu || "") +
                (dataItem.longnameEn || "") +
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
                className={classes.table}
                columns={mergedColumns}
                dataSource={data}
                rowKey="companyTypeId"
                rowClassName="editable-row"
                pagination={{
                    onChange: () => setEditingKey(-1),
                    pageSize: 7,
                    position: ["bottomCenter"]
                }}
            />
            <Suspense>
                <CompanyTypeModal
                    okText="Создать"
                    title={"Добавить тип компании"}
                    onFinish={save}
                    isVisible={isModalVisible}
                    setIsVisible={setIsModalVisible}
                    form={form}
                />
            </Suspense>
        </Form>
    );
};

export default CompanyTypeList;
