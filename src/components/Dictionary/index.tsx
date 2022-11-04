import { ChangeEvent, cloneElement, useCallback, ReactElement, SyntheticEvent } from "react";
import { Col, Dropdown, Row, Menu, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { CompanyTreeView } from "./companiesTreeView";
import { DivisionTreeView } from "./divisionTreeView";
import PositionList from "./Tables/positionTable";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";

import "./styles.scss";
import { useDispatch } from "react-redux";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { GenderTable } from "./Tables/genderTable";
import { CityTable } from "./Tables/cityTable";
import { CarTable } from "./Tables/carTable";
import { LanguageTable } from "./Tables/languageTable";
import { LanguageKnowledgeTable } from "./Tables/languageKnowledgeTable";
import { ContractTypeTable } from "./Tables/contractTypeTable";
import { DocumentTypeTable } from "./Tables/documentTypeTable";
import { IssueAuthorityTable } from "./Tables/issueAuthorityTable";
import { EducationTable } from "./Tables/educationTable";
import { EducationLevelTable } from "./Tables/educationLevelTable";
import { SpecialtyTable } from "./Tables/specialtyTable";
import { AddressTypeTable } from "./Tables/addressTypeTable";

const Dictionary = () => {
    const dispatch = useDispatch();

    const [tabActiveKey, setTabActiveKey] = useState(
        sessionStorage.getItem("directoriesActiveTabId") || "1"
    );

    const onSetTabActiveKey = useCallback((key: string) => {
        setTabActiveKey(key);
    }, []);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.dictionary));
    }, []);

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
            children: <GenderTable />
        },
        {
            label: "Города",
            key: "5",
            children: <CityTable />
        },
        {
            label: "Марки машин",
            key: "6",
            children: <CarTable />
        },
        {
            label: "Языки",
            key: "7",
            children: <LanguageTable />
        },
        {
            label: "Уровень знания языков",
            key: "8",
            children: <LanguageKnowledgeTable />
        },
        {
            label: "Типы договоров",
            key: "9",
            children: <ContractTypeTable />
        },
        {
            label: "Типы докуметов",
            key: "10",
            children: <DocumentTypeTable />
        },
        {
            label: "Органы выдачи документов",
            key: "11",
            children: <IssueAuthorityTable />
        },
        {
            label: "Учебные заведения",
            key: "12",
            children: <EducationTable />
        },
        {
            label: "Уровень образования",
            key: "13",
            children: <EducationLevelTable />
        },
        {
            label: "Специальность",
            key: "14",
            children: <SpecialtyTable />
        },
        {
            label: "Адрес",
            key: "15",
            children: <AddressTypeTable />
        }
    ];

    const selectionItems = items.map(({ key, label }) => ({ key, label }));
    const currentSelectedItem = items.find((item) => item.key === tabActiveKey)?.children;
    // const [searchableItems, setSearchableItems] =
    //     useState<Array<{ key: string; label: string }>>(itemsWithoutChildren);
    //
    // const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setSearchableItems(
    //         itemsWithoutChildren.filter(({ label }) =>
    //             label.toLowerCase().includes(e.target.value.toLowerCase())
    //         )
    //     );
    // };
    //
    // const handleInputClick = (e: SyntheticEvent) => {
    //     e.stopPropagation();
    // };

    // const dictionaryMenu = (
    //     <Menu>
    //         <Menu.Item>
    //             <Input
    //                 onClick={handleInputClick}
    //                 onChange={handleInputChange}
    //                 suffix={
    //                     <SearchOutlined style={{ cursor: "default" }} onClick={handleInputClick} />
    //                 }
    //             />
    //         </Menu.Item>
    //         {searchableItems.map(({ key, label }) => (
    //             <Menu.Item onClick={() => setTabActiveKey(key)}>{label}</Menu.Item>
    //         ))}
    //     </Menu>
    // );
    //
    // const DropdownBar = (
    //     <Dropdown
    //         overlay={dictionaryMenu}
    //         overlayStyle={{ maxHeight: "300px", height: "fit-content", overflowY: "scroll" }}
    //     >
    //         <Button type={"link"} style={{ color: "black", paddingLeft: "16px", border: 0 }}>
    //             <EllipsisOutlined />
    //         </Button>
    //     </Dropdown>
    // );

    return (
        <Row style={{ padding: "20px", marginRight: 0, marginLeft: 0 }} gutter={[16, 16]}>
            <Col span={24}>
                {cloneElement(currentSelectedItem as ReactElement, {
                    selectionItems,
                    onSetTabActiveKey
                })}
            </Col>
        </Row>
    );
};

export default Dictionary;
