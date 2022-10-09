import React, { FC, useMemo, useState } from "react";
import Header from "ui/Header";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Row, Input, Button, Table, Select } from "antd";
import "./styles.scss";
import usersSortValues, {
    usersTableData,
    DATE,
    ALPHABET,
    PROFESSION,
    VERIFICATION,
    VERIFIED
} from "./defaultData";
import { IUsersTableModel } from "interfaces";
import { useNavigate } from "react-router";

const { Option } = Select;

const Users: FC = () => {
    const [data, setData] = useState<IUsersTableModel[]>(usersTableData);
    const navigate = useNavigate();

    const handleFioClick = (id: string | number) => () => navigate(`/users/${id}`);
    const handleSortChange = (v: string) => {
        if (v === DATE) {
            setData([
                ...data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            ]);
        }
        if (v === ALPHABET) {
            setData([...data.sort((a, b) => a.fullName[0].localeCompare(b.fullName[0]))]);
        }
        if (v === PROFESSION) {
            setData([...data.sort((a, b) => a.profession.localeCompare(b.profession))]);
        }
        if (v === VERIFICATION) {
            setData([
                ...data.filter(({ status }) => status.toLowerCase() === VERIFIED),
                ...data.filter(({ status }) => status.toLowerCase() !== VERIFIED)
            ]);
        }
    };
    const handleFiltrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(
            usersTableData.filter((dataItem) =>
                Object.values(dataItem).some((value) =>
                    (value + "").toLowerCase().includes(e.target.value.toLowerCase())
                )
            )
        );
    };

    const memoizedColumns = useMemo(
        () => [
            {
                title: "ФИО",
                key: "fullName",
                dataIndex: "fullName",
                width: 200,
                render: (_: any, record: IUsersTableModel) => (
                    <span className="usersTable__fullName" onClick={handleFioClick(record.id)}>
                        {record.fullName}
                    </span>
                )
            },
            {
                title: "E-mail",
                key: "email",
                dataIndex: "email"
            },
            {
                title: "Статус",
                key: "status",

                dataIndex: "status"
            },
            {
                title: "Должность",
                key: "profession",
                dataIndex: "profession"
            },
            {
                title: "Номер телефона",
                key: "phone",
                dataIndex: "phone"
            }
        ],
        []
    );

    return (
        <Row style={{ padding: "20px", marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }} gutter={[16, 16]}>
                <Col>
                    <Header size="h2">Сотрудники</Header>
                </Col>
                <Col>
                    <Button
                        style={{ background: "#1890ff", color: "#fff", borderRadius: "6px" }}
                        icon={<PlusOutlined />}
                    >
                        Добавить нового сотрудника
                    </Button>
                </Col>
                <Col>
                    <Input
                        style={{ width: 200, borderRadius: "6px" }}
                        onChange={handleFiltrationChange}
                        placeholder="Поиск"
                        suffix={<SearchOutlined style={{ color: "#828282" }} />}
                    />
                </Col>
                <Col style={{ display: "flex", flex: "1 1 auto", justifyContent: "end" }}>
                    <Select
                        onChange={handleSortChange}
                        placeholder="Сортировка"
                        style={{ width: 200, borderRadius: "6px" }}
                    >
                        {usersSortValues.map(([k, v]) => (
                            <Option key={k} value={k}>
                                {v}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }}>
                <Table
                    className={"usersTable"}
                    style={{ width: "100%" }}
                    columns={memoizedColumns}
                    dataSource={data}
                    rowKey="usersId"
                    pagination={{
                        pageSize: 5,
                        position: ["bottomCenter"]
                    }}
                />
            </Row>
        </Row>
    );
};
export default Users;
