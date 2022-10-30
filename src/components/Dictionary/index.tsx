import { ChangeEvent, SyntheticEvent } from "react";
import { Col, Dropdown, Row, Tabs, Menu, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { CompanyTreeView } from "./companiesTreeView";
import { DivisionTreeView } from "./divisionTreeView";
import PositionList from "./Tables/positionTable";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";

import "./styles.scss";
import { Tables } from "./Tables";

const Dictionary = () => {
    const [tabActiveKey, setTabActiveKey] = useState(
        sessionStorage.getItem("directoriesActiveTabId") || "1"
    );

    useEffect(() => {
        sessionStorage.setItem("directoriesActiveTabId", tabActiveKey);
    }, [tabActiveKey]);

    const items = [
        {
            label: "Компании",
            key: "1",
            children: <CompanyTreeView />
        },
        {
            label: "Подразделения",
            key: "2",
            children: <DivisionTreeView />
        },
        {
            label: "Должности",
            key: "3",
            children: <PositionList />
        },
        {
            label: "Пол",
            key: "4",
            children: Tables.genderTable
        },
        {
            label: "Города",
            key: "5",
            children: Tables.cityTable
        },
        {
            label: "Марки машин",
            key: "6",
            children: Tables.carTable
        },
        {
            label: "Языки",
            key: "7",
            children: Tables.languageTable
        },
        {
            label: "Уровень знания языков",
            key: "8",
            children: Tables.languageKnowledgeTable
        },
        {
            label: "Типы договоров",
            key: "9",
            children: Tables.contractTypeTable
        },
        {
            label: "Типы докуметов",
            key: "10",
            children: Tables.documentTypeTable
        },
        {
            label: "Органы выдачи документов",
            key: "11",
            children: Tables.issueAuthorityTable
        },
        {
            label: "Учебные заведения",
            key: "12",
            children: Tables.educationTable
        },
        {
            label: "Уровень образования",
            key: "13",
            children: Tables.educationLevelTable
        },
        {
            label: "Специальность",
            key: "14",
            children: Tables.specialtyTable
        }
    ];

    const itemsWithoutChildren = items.map(({ key, label }) => ({ key, label }));
    const [searchableItems, setSearchableItems] =
        useState<Array<{ key: string; label: string }>>(itemsWithoutChildren);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchableItems(
            itemsWithoutChildren.filter(({ label }) =>
                label.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    const handleInputClick = (e: SyntheticEvent) => {
        e.stopPropagation();
    };

    const dictionaryMenu = (
        <Menu>
            <Menu.Item>
                <Input
                    onClick={handleInputClick}
                    onChange={handleInputChange}
                    suffix={
                        <SearchOutlined style={{ cursor: "default" }} onClick={handleInputClick} />
                    }
                />
            </Menu.Item>
            {searchableItems.map(({ key, label }) => (
                <Menu.Item onClick={() => setTabActiveKey(key)}>{label}</Menu.Item>
            ))}
        </Menu>
    );

    const DropdownBar = (
        <Dropdown
            overlay={dictionaryMenu}
            overlayStyle={{ maxHeight: "300px", height: "fit-content", overflowY: "scroll" }}
        >
            <Button type={"link"} style={{ color: "black", paddingLeft: "16px", border: 0 }}>
                <EllipsisOutlined />
            </Button>
        </Dropdown>
    );

    return (
        <Row style={{ padding: "20px", marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Col span={24}>
                <Tabs
                    activeKey={tabActiveKey}
                    onChange={(key: string) => setTabActiveKey(key)}
                    tabBarExtraContent={DropdownBar}
                    items={items}
                />
            </Col>
        </Row>
    );
};

export default Dictionary;
