import React, { FC, useCallback, useContext, useEffect, useState, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { Row, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import {
    createTableViaTabulator,
    fullNameTableActionsFormatter,
    customGroupHeader
} from "services/tabulator";
import { userUsersColumns } from "data/columns";
import { ColumnDefinition } from "tabulator-tables";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import { IUsersDtoViewModel } from "interfaces";
import getFullName from "utils/getFullName";

const UserDrawer = React.lazy(() => import("./userDrawer"));

interface IUsersWithPhoto extends IUsersDtoViewModel {
    currentPhotoId?: string;
}

export interface IUsersWithPhotoInfo extends IUsersWithPhoto {
    fullName?: string;
}

const Users: FC = () => {
    const dispatch = useDispatch();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [table, setTable] = useState<Tabulator | undefined>();
    const [tableData, setTableData] = useState<IUsersWithPhoto[]>([]);
    const [currentUserInfo, setCurrentUserInfo] = useState<IUsersWithPhotoInfo>(
        {} as IUsersWithPhotoInfo
    );
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);

    const [currentUserDivisionId, setCurrentUserDivisionId] = useState<number | undefined>(
        undefined
    );

    const [query, setQuery] = useState("");
    const { searchStr } = useDelayedInputSearch(query);

    const handleFiltrationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.users));
    }, []);

    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        const searchedTableData = tableData.filter((tableItem) => {
            const tableDataStr =
                getFullName(tableItem.firstname, tableItem.lastname, tableItem.patronymic) +
                (tableItem.personalContact?.email || "") +
                (tableItem.personalContact?.mobilePhoneNumber || "") +
                (tableItem.company?.nameRu || "") +
                (tableItem.division?.nameRu || "");
            return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
        });

        table?.replaceData(searchedTableData);
        table?.redraw(true);
    }, [searchStr]);

    const { getCurrentUserData, getUsersWithPhotoId } = useSimpleHttpFunctions();

    const initData = async () => {
        createTableViaTabulator(
            "#usersTable",
            userUsersColumns,
            [],
            () => {},
            true,
            customGroupHeader
        );
        const currentUserData: IUsersDtoViewModel = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company?.companyId;
            setCurrentUserDivisionId(currentUserData.divisionId);
            const userData: IUsersDtoViewModel[] = await actionMethodResultSync(
                "USER",
                `user?companyId=${companyId}&requestType=ALL`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);

            const userDataWithPhoto: IUsersWithPhoto[] = await getUsersWithPhotoId(userData);

            const actionsSell: ColumnDefinition = {
                headerSort: false,
                title: "ФИО",
                field: "fullName",
                formatter: fullNameTableActionsFormatter
            };

            setTableData(userDataWithPhoto);

            await setTable(
                createTableViaTabulator(
                    "#usersTable",
                    [actionsSell, ...userUsersColumns],
                    userDataWithPhoto,
                    handleFioClick,
                    undefined,
                    customGroupHeader
                )
            );
        }
    };

    const handleFioClick = (e: UIEvent, row: Tabulator.RowComponent) => {
        setCurrentUserInfo(row.getData());
        setUserDrawerOpen(true);
    };

    return (
        <Row className={classes.wrapper}>
            <Row align={"middle"} justify={"end"} className={classes.selectionRow}>
                <Col>
                    <Input
                        className={classes.input}
                        onChange={handleFiltrationChange}
                        placeholder="Поиск"
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                </Col>
            </Row>
            <Row className={classes.tableWrap}>
                <div id="usersTable" />
            </Row>
            <Suspense>
                <UserDrawer
                    divisionsEquality={currentUserInfo.divisionId === currentUserDivisionId}
                    open={userDrawerOpen}
                    setOpen={setUserDrawerOpen}
                    userData={currentUserInfo}
                />
            </Suspense>
        </Row>
    );
};
export default Users;
