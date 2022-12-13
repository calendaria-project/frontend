import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { Col, DatePicker, Input, Row, Select } from "antd";
import {
    ICurrentUserDtoViewModel,
    IDivisionViewModel,
    IUsersByStaffingDtoModel,
    IUsersByStaffingDtoViewModel
} from "interfaces";
import { ALL } from "../../data/constants";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import getFullName from "utils/getFullName";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import questionImage from "assets/icons/question.png";
import { createTableViaTabulator } from "services/tabulator";
import { usersByStaffingColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ColumnDefinition } from "tabulator-tables";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const Staffing: FC = () => {
    const dispatch = useDispatch();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.staffing));
    }, []);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [table, setTable] = useState<Tabulator | undefined>();
    const [tableData, setTableData] = useState<IUsersByStaffingDtoViewModel[]>([]);

    const { getCurrentUserData, getUsersWithPhotoId, getDivisionOptions } =
        useSimpleHttpFunctions();

    const [divisions, setDivisions] = useState<IDivisionViewModel[]>([]);
    const [currentDivisionId, setCurrentDivisionId] = useState<string | number>(ALL);
    const onChangeCurrentDivisionId = useCallback((v: any) => setCurrentDivisionId(v), []);
    const divisionValues: any = [{ divisionId: ALL, nameRu: "Все подразделения" }, ...divisions];

    useEffect(() => {
        getDivisions();
    }, [companyId]);
    const getDivisions = async () => {
        if (companyId) {
            const divisions = await getDivisionOptions(companyId);
            console.log(divisions);
            setDivisions(divisions);
        }
    };

    const [query, setQuery] = useState("");
    const { searchStr } = useDelayedInputSearch(query);
    const handleFiltrationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    useEffect(() => {
        const searchedTableData = tableData.filter((tableItem) => {
            const tableDataStr =
                getFullName(tableItem.firstname, tableItem.lastname, tableItem.patronymic) +
                (tableItem.position?.nameRu || "") +
                (tableItem.salary || "") +
                (tableItem.salaryVariablePart || "") +
                (tableItem.salaryConstantPart || "");
            return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
        });

        let searchedAndFilteredTableData =
            currentDivisionId !== ALL
                ? searchedTableData.filter(
                      (item) => item.division?.divisionId === currentDivisionId
                  )
                : searchedTableData;

        table?.replaceData(searchedAndFilteredTableData);
        table?.redraw(true);
    }, [searchStr, currentDivisionId]);

    useEffect(() => {
        initData();
    }, []);

    const fullNameTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        const data: any = cell.getData();

        const userPhoto = data.currentPhotoId;

        let photoElement = document.createElement("img");
        photoElement.setAttribute("src", userPhoto ? userPhoto : questionImage);
        photoElement.setAttribute("class", classes.usersByStaffingPhoto);
        photoElement.setAttribute("width", "30px");
        photoElement.setAttribute("height", "30px");

        let textElement = document.createElement("span");
        textElement.setAttribute("class", classes.fullNameText);
        textElement.textContent = `${data.lastname ?? ""} ${data.firstname ?? ""} ${
            data.patronymic ?? ""
        }`;

        let wrap = document.createElement("div");
        wrap.setAttribute("class", classes.fullNameWrap);
        wrap.appendChild(photoElement);
        wrap.appendChild(textElement);
        return wrap;
    };

    const initData = async () => {
        createTableViaTabulator("#staffingTable", usersByStaffingColumns, [], () => {}, true);
        const currentUserData: ICurrentUserDtoViewModel = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            setCompanyId(companyId);
            const userDataByStaffing: IUsersByStaffingDtoModel[] = await actionMethodResultSync(
                "USER",
                `user/byStaffing?companyId=${companyId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);

            const userDataByStaffingWithFormattedSalary: IUsersByStaffingDtoModel[] =
                userDataByStaffing.map((userItem) => ({
                    ...userItem,
                    salary: `${userItem.salary ?? 0} ₸`,
                    salaryConstantPart: `${userItem.salaryConstantPart ?? 0} ₸`,
                    salaryVariablePart: `${userItem.salaryVariablePart ?? 0} ₸`
                }));

            const userDataByStaffingWithPhoto: IUsersByStaffingDtoViewModel[] =
                await getUsersWithPhotoId(userDataByStaffingWithFormattedSalary);

            const actionsSell: ColumnDefinition = {
                headerSort: false,
                title: "ФИО",
                field: "fullName",
                formatter: fullNameTableActionsFormatter
            };

            setTableData(userDataByStaffingWithPhoto);

            await setTable(
                createTableViaTabulator(
                    "#staffingTable",
                    [actionsSell, ...usersByStaffingColumns],
                    userDataByStaffingWithPhoto,
                    () => {},
                    undefined
                )
            );
        }
    };

    return (
        <Row className={classes.wrapper}>
            <Row align={"middle"} justify={"space-between"} className={classes.selectionRow}>
                <Col>
                    <Select
                        showSearch
                        optionFilterProp={"children"}
                        className={classes.select}
                        value={currentDivisionId}
                        onChange={onChangeCurrentDivisionId}
                    >
                        {divisionValues.map((el: any, index: number) => (
                            <Option value={el.divisionId} key={index}>
                                {el.nameRu}
                            </Option>
                        ))}
                    </Select>
                    <DatePicker className={classes.datePicker} />
                </Col>
                <Col>
                    <Input
                        className={classes.input}
                        onChange={handleFiltrationChange}
                        placeholder="Поиск"
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                </Col>
            </Row>
            <Row className={classes.usersByStaffingTableWrap}>
                <div id="staffingTable" />
            </Row>
        </Row>
    );
};

export default Staffing;
