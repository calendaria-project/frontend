import React, { useCallback, Suspense } from "react";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row, Select } from "antd";
import Button from "ui/Button";
import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { usersColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useNavigate } from "react-router";
import {
    createTableViaTabulator,
    customGroupHeader,
    fullNameTableActionsFormatter
} from "services/tabulator";
import { ColumnDefinition } from "tabulator-tables";

import useDelayedInputSearch from "hooks/useDelayedInputSearch";

import { useDispatch } from "react-redux";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { IUsersViewModel } from "interfaces";
import { IUsersWithPhotoModel } from "interfaces/extended";
import getFullName from "utils/getFullName";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import cx from "classnames";
import { ALL } from "data/constants";
import { requestTypeValues } from "./defaultValues";

const { Option } = Select;

const UserAddDrawer = React.lazy(() => import("./userDrawer/UserAddDrawer"));

const Users: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [companyName, setCompanyName] = useState<string | undefined>();
    const [isVisibleAddUserDrawer, setIsVisibleAddUserDrawer] = useState(false);
    const [table, setTable] = useState<Tabulator | undefined>();
    const [tableData, setTableData] = useState<IUsersWithPhotoModel[]>([]);

    const [query, setQuery] = useState("");
    const { searchStr, handleFiltrationChange } = useDelayedInputSearch(query, setQuery);

    const [requestType, setRequestType] = useState(sessionStorage.getItem("userReqType") || ALL);

    useEffect(() => {
        sessionStorage.setItem("userReqType", requestType);
    }, [requestType]);

    const onChangeRequestType = useCallback((v: string) => setRequestType(v), []);

    const { getCurrentUserData, getUsersWithPhotoId } = useSimpleHttpFunctions();

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.users));
    }, []);

    useEffect(() => {
        initData();
    }, [requestType]);

    useEffect(() => {
        const searchedTableData = tableData.filter((tableItem) => {
            const tableDataStr =
                getFullName(tableItem.firstname, tableItem.lastname, tableItem.patronymic) +
                (tableItem.iin || "") +
                (tableItem.position?.nameRu || "") +
                (tableItem.personalContact?.mobilePhoneNumber || "") +
                (tableItem.personalContact?.email || "") +
                (tableItem.employmentDate || "");
            return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
        });

        table?.replaceData(searchedTableData);
        table?.redraw(true);
    }, [searchStr]);

    const initData = async () => {
        createTableViaTabulator("#usersTable", usersColumns, [], () => {}, true, customGroupHeader);
        const currentUserData: IUsersViewModel = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            const companyName = currentUserData.company.nameRu;

            setCompanyId(companyId);
            setCompanyName(companyName);
            const userData: IUsersViewModel[] = await actionMethodResultSync(
                "USER",
                `user?companyId=${companyId}&requestType=${requestType}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);

            const userDataWithPhoto: IUsersWithPhotoModel[] = await getUsersWithPhotoId(userData);
            setTableData(userDataWithPhoto);

            console.log(userData);

            const actionsSell: ColumnDefinition = {
                headerSort: false,
                title: "ФИО",
                field: "fullName",
                formatter: fullNameTableActionsFormatter
            };

            await setTable(
                createTableViaTabulator(
                    "#usersTable",
                    [actionsSell, ...usersColumns],
                    userDataWithPhoto,
                    handleFioClick,
                    undefined,
                    customGroupHeader
                )
            );
        }
    };

    const handleFioClick = (e: UIEvent, row: Tabulator.RowComponent) =>
        navigate(`/users/${row.getData()?.userId}`);

    const onFinishCreatingUser = (data: any) => {
        table?.addData(data);
        table?.redraw(true);
    };

    const showDrawer = () => setIsVisibleAddUserDrawer(true);

    return (
        <Row className={classes.container}>
            <Row className={classes.searchingWrapper}>
                <Col className={classes.searchingCol}>
                    <Input
                        className={classes.input}
                        onChange={handleFiltrationChange}
                        placeholder="Поиск"
                        suffix={<SearchOutlined className={classes.searchIcon} />}
                    />
                </Col>
                <Col className={cx(classes.searchingCol, classes.selectCol)}>
                    <Select
                        className={classes.select}
                        value={requestType}
                        onChange={onChangeRequestType}
                    >
                        {requestTypeValues.map(({ type, label }) => (
                            <Option value={type} key={type}>
                                {label}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col className={cx(classes.searchingCol, classes.endedCol)}>
                    <Button
                        className={classes.button}
                        customType={"regular"}
                        icon={<PlusOutlined />}
                        onClick={showDrawer}
                    >
                        Добавить
                    </Button>
                </Col>
            </Row>
            <Row className={classes.usersTableWrapper}>
                <div id="usersTable" />
            </Row>
            <Suspense>
                <UserAddDrawer
                    companyId={companyId}
                    open={isVisibleAddUserDrawer}
                    setOpen={setIsVisibleAddUserDrawer}
                    companyName={companyName}
                    onFinishCreatingUser={onFinishCreatingUser}
                />
            </Suspense>
        </Row>
    );
};
export default Users;
