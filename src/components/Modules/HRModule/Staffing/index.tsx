import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { Col, DatePicker, Input, Row, Select } from "antd";
import { IUsersViewModel, IDivisionViewModel, IUsersByStaffingViewModel } from "interfaces";
import { IUsersByStaffingDtoViewModel } from "interfaces/extended";
import { ALL } from "data/constants";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import getFullName from "utils/getFullName";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { createTableViaTabulator, fullNameTableActionsFormatter } from "services/tabulator";
import { usersByStaffingColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { ColumnDefinition } from "tabulator-tables";
import { SearchOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";

const { Option } = Select;

const Staffing: FC = () => {
    const dispatch = useDispatch();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.staffing));
    }, []);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [table, setTable] = useState<Tabulator | undefined>();
    const [tableData, setTableData] = useState<IUsersByStaffingDtoViewModel[]>([]);

    const { getCurrentUserData, getUsersWithPhotoId, getDivisionOptions } =
        useSimpleHttpFunctions();

    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [divisions, setDivisions] = useState<IDivisionViewModel[]>([]);
    const divisionValues: any = [{ divisionId: ALL, nameRu: "Все подразделения" }, ...divisions];

    useEffect(() => {
        getDivisions();
    }, [companyId]);
    const getDivisions = async () => {
        if (companyId) {
            const divisions = await getDivisionOptions(companyId);
            setDivisions(divisions);
        }
    };

    const [currentDivisionId, setCurrentDivisionId] = useState<string | number>(
        JSON.parse(sessionStorage.getItem("usersByStaffingDivision") as string) || ALL
    );
    const onChangeCurrentDivisionId = useCallback((v: any) => setCurrentDivisionId(v), []);

    useEffect(() => {
        sessionStorage.setItem("usersByStaffingDivision", JSON.stringify(currentDivisionId));
    }, [divisions, currentDivisionId]);

    const dateString = JSON.parse(sessionStorage.getItem("usersByStaffingDate") as string);
    const [date, setDate] = useState<Moment | null>(
        (dateString ? moment(dateString, "YYYY-MM-DD") : dateString) || null
    );
    const onChangeDate = useCallback((newDate: any, dateString: string) => {
        dateString ? setDate(moment(dateString, "YYYY-MM-DD")) : setDate(null);
    }, []);

    useEffect(() => {
        sessionStorage.setItem(
            "usersByStaffingDate",
            JSON.stringify(date ? (date as any)._i : null)
        );
    }, [date]);

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

        const searchedAndFilteredTableData =
            currentDivisionId !== ALL
                ? searchedTableData.filter(
                      (item) => item.division?.divisionId === currentDivisionId
                  )
                : searchedTableData;

        const resultDataFilteredByDate = date
            ? searchedAndFilteredTableData.filter(
                  (item) => item.employmentDate === (date as any)._i
              )
            : searchedAndFilteredTableData;

        table?.replaceData(resultDataFilteredByDate);
        table?.redraw(true);
    }, [tableData, searchStr, currentDivisionId, date]);

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        createTableViaTabulator("#staffingTable", usersByStaffingColumns, [], () => {}, true);
        const currentUserData: IUsersViewModel = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            setCompanyId(companyId);
            const userDataByStaffing: IUsersByStaffingViewModel[] = await actionMethodResultSync(
                "USER",
                `user/byStaffing?companyId=${companyId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);

            const userDataByStaffingWithFormattedSalary: IUsersByStaffingViewModel[] =
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
                    <DatePicker
                        value={date}
                        placeholder="Дата приема"
                        onChange={onChangeDate}
                        className={classes.datePicker}
                    />
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
