import { cloneElement, ReactElement } from "react";
import { Col, Row } from "antd";
import { useEffect } from "react";
import { CompanyTreeView } from "./companiesTreeView";
import { DivisionTreeView } from "./divisionTreeView";
import PositionList from "./Tables/positionTable";
import CompanyTypeList from "./Tables/companyTypeTable";

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
import { RelationshipTypeTable } from "./Tables/relationshipTypeTable";
import { MilitaryRankTable } from "./Tables/militaryRankTable";
import { WorkTypeTable } from "./Tables/workTypeTable";
import { WorkKindTable } from "./Tables/workKindTable";
import { ContractFormTypeTable } from "./Tables/contractFormTypeTable";
import { ContractNormTypeTable } from "./Tables/contractNormTypeTable";
import { ContractNormConditionTable } from "./Tables/contractNormConditionTable";
import { TaskRoleTable } from "./Tables/taskRoleTable";
import { SelectionMethodTypeTable } from "./Tables/selectionMethodTypeTable";
import { AnalysisMethodTypeTable } from "./Tables/analysisMethodTypeTable";
import { AppItemTypeTable } from "./Tables/appItemTypeTable";
import { MobileTariffTable } from "./Tables/mobileTariffTable";
import AppItemAccessTypeList from "./Tables/appItemAccessType";

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
        },
        {
            label: "Степень родства",
            key: "16",
            children: <RelationshipTypeTable />
        },
        {
            label: "Воинское звание",
            key: "17",
            children: <MilitaryRankTable />
        },
        {
            label: "Тип работ",
            key: "18",
            children: <WorkTypeTable />
        },
        {
            label: "Вид работ",
            key: "19",
            children: <WorkKindTable />
        },
        {
            label: "Типы компаний",
            key: "20",
            children: <CompanyTypeList />
        },
        {
            label: "Типы форм для доп. соглашений",
            key: "21",
            children: <ContractFormTypeTable />
        },
        {
            label: "Типы нормирования труда",
            key: "22",
            children: <ContractNormTypeTable />
        },
        {
            label: "Типы условий труда",
            key: "23",
            children: <ContractNormConditionTable />
        },
        {
            label: "Типы ролей",
            key: "24",
            children: <TaskRoleTable />
        },
        {
            label: "Типы выбора метода",
            key: "25",
            children: <SelectionMethodTypeTable />
        },
        {
            label: "Типы анализа метода",
            key: "26",
            children: <AnalysisMethodTypeTable />
        },
        {
            label: "Доступы",
            key: "27",
            children: <AppItemTypeTable />
        },
        {
            label: "Мобильные тарифы",
            key: "28",
            children: <MobileTariffTable />
        },
        {
            label: "Типы доступа",
            key: "29",
            children: <AppItemAccessTypeList />
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
