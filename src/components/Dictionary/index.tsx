import { Col, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { CompanyTreeView } from "./companiesTreeView";
import { DivisionTreeView } from "./divisionTreeView";
import PositionList from "./Tables/positionTable";

import "./styles.scss";
import { Tables } from "./Tables";

const Dictionary = () => {
    const [tabActiveKey, setTabActiveKey] = useState(
        sessionStorage.getItem("directoriesActiveTabId") || "1"
    );

    useEffect(() => {
        sessionStorage.setItem("directoriesActiveTabId", tabActiveKey);
    }, [tabActiveKey]);

    return (
        <Row style={{ padding: "20px", marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Col span={24}>
                <Tabs
                    activeKey={tabActiveKey}
                    onChange={(key: string) => setTabActiveKey(key)}
                    items={[
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
                    ]}
                />
            </Col>
        </Row>
    );
};

export default Dictionary;
