import { FC, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Col, Row, Form, Button, Table, Select, DatePicker } from 'antd';
import moment from "moment";

import { AuthContext } from 'context/AuthContextProvider';
import { ICompanyViewModel, IStaffingModel } from 'interfaces';
import Header from 'ui/Header';
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { StaffingScheduleModal } from './modal';
import './styles.scss';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'date';
    record: IStaffingModel;
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
    const dateFormat = "DD/MM/YYYY";
    if (dataIndex === "fromDate") {
        record.fromDate = moment(record.fromDate, moment.ISO_8601);
    }
    if (dataIndex === "toDate") {
        record.toDate = moment(record.toDate, moment.ISO_8601);
    }
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: dataIndex !== 'toDate' ? true : false,
                            message: 'Обязательное поле!',
                        },
                    ]}
                >
                    <DatePicker
                        format={dateFormat}
                    />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const { Option } = Select;

const Staffing: FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<IStaffingModel[]>([]);
    const authContext = useContext(AuthContext);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [companies, setCompanies] = useState<ICompanyViewModel[]>([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>(Number(localStorage.getItem('staffing_company_id')));

    const isEditing = (record: IStaffingModel) => record.staffingId === editingKey;

    const edit = (record: Partial<IStaffingModel>) => {
        form.setFieldsValue({ fromDate: '', toDate: '', ...record });
        setEditingKey(record.staffingId || -1);
    };

    const save = async (record: IStaffingModel) => {
        try {
            let row = (await form.validateFields()) as IStaffingModel;

            const newData = [...data];
            const index = newData.findIndex(item => record.staffingId === item.staffingId);
            if (index > -1) {
                const item = newData[index];
                row = {...item, fromDate: moment(row.fromDate._d).format('YYYY-MM-DD'), toDate: moment(row.toDate._d).format('YYYY-MM-DD')};
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                actionMethodResultSync('staffing', "put", getRequestHeader(authContext.token), newData[index])
                    .then(() => {
                        setData(newData);
                        setEditingKey(-1);
                    })
            } else {
                const reqBody = {
                    companyId: selectedCompanyId,
                    fromDate: moment(record.fromDate).format('YYYY-MM-DD'),
                    toDate: moment(record.toDate).format('YYYY-MM-DD'),
                }
                actionMethodResultSync('staffing', "post", getRequestHeader(authContext.token), reqBody)
                    .then((res) => {
                        newData.push({ ...res });
                        setData(newData);
                        setIsModalVisible(false);
                    })
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'staffingId',
            width: 200,
        },
        {
            title: 'Дата действия с',
            dataIndex: 'fromDate',
            width: 250,
            editable: true,
            render: (_: any, record: IStaffingModel) => new Date(record.fromDate).toLocaleDateString('ru-RU')
        },
        {
            title: 'Дата действия по',
            dataIndex: 'toDate',
            width: 250,
            editable: true,
            render: (_: any, record: IStaffingModel) => new Date(record.toDate).toLocaleDateString('ru-RU')
        },
        {
            title: 'Действие',
            dataIndex: 'operation',
            width: 400,
            render: (_: any, record: IStaffingModel) => {
                const editable = isEditing(record);
                return editable ? (
                    <>
                        <Button style={{ background: '#1890ff', color: '#fff', marginRight: 8 }} onClick={() => save(record)}>
                            Сохранить
                        </Button>
                        <Button style={{ background: '#e6d87e' }} onClick={() => setEditingKey(-1)}>
                            Отмена
                        </Button>
                    </>
                ) : (
                    <>
                        <Button style={{ background: '#89b8ff', marginRight: 4 }} onClick={() => navigate(`/staffing/${record.staffingId}`)}>
                            Посмотреть
                        </Button>
                        <Button style={{ background: '#e6d87e', marginRight: 4 }} disabled={editingKey !== -1} onClick={() => edit(record)}>
                            Изменить
                        </Button>
                        <Button style={{ background: '#cd4731' }} disabled>
                            Удалить
                        </Button>
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: IStaffingModel) => ({
                record,
                inputType: 'date',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    useEffect(() => {
        getCompanies();
    }, []);

    const getCompanies = () => {
        actionMethodResultSync("company?page=0&size=100&sortingRule=companyId%3AASC", "get", getRequestHeader(authContext.token))
            .then(res => setCompanies(res.content))
    }

    useEffect(() => {
        if (selectedCompanyId) {
            actionMethodResultSync(`staffing?companyId=${selectedCompanyId}`, "get", getRequestHeader(authContext.token))
                .then(resData => {
                    setData(resData);
                })
        }
    }, [selectedCompanyId]);

    return (
        <Row style={{ marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Col span={24}>
                <Header size="h2">Штатные расписания</Header>
            </Col>
            <Col span={24}>
                <Form form={form} component={false}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Select
                                placeholder="Выберите компанию"
                                style={{ width: 250 }}
                                value={selectedCompanyId || null}
                                onChange={(val) => {
                                    localStorage.setItem('staffing_company_id', val.toString());
                                    setSelectedCompanyId(+val);
                                }}
                            >
                                {
                                    companies.map((el, i) => (
                                        <Option key={i} value={el.companyId}>{el.nameRu}</Option>
                                    ))
                                }
                            </Select>
                            <Button
                                disabled={!selectedCompanyId}
                                style={{ background: `${!selectedCompanyId ? 'lightgrey' : '#1890ff'}`, color: '#fff', marginBottom: 10 }}
                                onClick={() => setIsModalVisible(true)}
                            >
                                Добавить
                            </Button>
                        </Col>
                    </Row>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        columns={mergedColumns}
                        dataSource={data}
                        rowKey="staffingId"
                        rowClassName="editable-row"
                        pagination={{
                            onChange: () => setEditingKey(-1),
                            pageSize: 5,
                            position: ['bottomCenter']
                        }}
                    />
                    <StaffingScheduleModal
                        okText="Создать"
                        title="Новое расписание"
                        onFinish={save}
                        isVisible={isModalVisible}
                        setIsVisible={setIsModalVisible}
                        form={form}
                    />
                </Form>
            </Col>
        </Row>
    )
}

export default Staffing;