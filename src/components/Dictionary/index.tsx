import { cloneElement, ReactElement } from "react";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { CompanyTreeView } from "./companiesTreeView";
import { DivisionTreeView } from "./divisionTreeView";
import PositionList from "./Tables/positionTable";

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
import { useTypedSelector } from "hooks/useTypedSelector";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";

const Dictionary = () => {
    const dispatch = useDispatch();

    const theme = useTheme<ITheme>();
    //@ts-ignore
    const classes = useStyles(theme);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.dictionary));
    }, []);

    const tabActiveKey = useTypedSelector((state) => state.menu.tabActiveKey);

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

    return (
        <Row className={classes.row}>
            <Col span={24}>
                {cloneElement(currentSelectedItem as ReactElement, {
                    selectionItems
                })}
            </Col>
        </Row>
    );
};

export default Dictionary;
