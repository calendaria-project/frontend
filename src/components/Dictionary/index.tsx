import { Col, Row, Tabs } from 'antd';
import { useEffect, useState } from "react";
import { CompanyTreeView } from "./companiesTreeView";
import { DivisionTreeView } from "./divisionTreeView";
import PositionList from './positionTable';

const Dictionary = () => {

    const [tabActiveKey, setTabActiveKey] = useState(sessionStorage.getItem("directoriesActiveTabId") || "1")

    useEffect(() => {
        sessionStorage.setItem("directoriesActiveTabId", tabActiveKey)
    }, [tabActiveKey])

    return (
        <Row style={{ padding: '20px', marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Col span={24} >
                <Tabs
                    activeKey={tabActiveKey}
                    onChange={(key: string) => setTabActiveKey(key)}
                    items={[
                        {
                            label: 'Компании',
                            key: '1',
                            children: <CompanyTreeView />,
                        },
                        {
                            label: 'Подразделения',
                            key: '2',
                            children: <DivisionTreeView />,
                        },
                        {
                            label: 'Должности',
                            key: '3',
                            children: <PositionList />,
                        },
                    ]}
                />
            </Col>
        </Row>
    )
}

export default Dictionary;