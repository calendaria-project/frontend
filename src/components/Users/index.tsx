import React, { useCallback } from "react";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Input, Row } from "antd";
import Button from "ui/Button";
import { FC, useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { usersColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useNavigate } from "react-router";
import { createTableViaTabulator } from "services/tabulator";
import { UserAddDrawer } from "./userDrawer/UserAddDrawer";
import { ColumnDefinition } from "tabulator-tables";

import useDelayedInputSearch from "hooks/useDelayedInputSearch";

import questionImage from "assets/icons/question.png";
import { useDispatch } from "react-redux";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { ICurrentUserDtoViewModel, IUsersDtoViewModel } from "interfaces";
import getFullName from "utils/getFullName";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

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
    const [tableData, setTableData] = useState<IUsersDtoViewModel[]>([]);

    const [query, setQuery] = useState("");
    const { searchStr } = useDelayedInputSearch(query);

    const { getCurrentUserData } = useSimpleHttpFunctions();

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
                // (tableItem.status || "") +
                (tableItem.position?.nameRu || "") +
                (tableItem.personalContact?.mobilePhoneNumber || "");
            return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
        });

        table?.replaceData(searchedTableData);
        table?.redraw(true);
    }, [searchStr]);

    const fullNameTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        const data: any = cell.getData();

        const userPhoto = data.currentUserPhotoId;

        let photoElement = document.createElement("img");
        photoElement.setAttribute("src", userPhoto ? userPhoto : questionImage);
        photoElement.setAttribute("class", classes.userPhoto);
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

    const customGroupHeader = (
        value: any,
        count: number,
        data: any,
        group: Tabulator.GroupComponent
    ): any => {
        let divisionName = "";
        if (data.length !== 0) {
            divisionName = data[0].division.nameRu;
        }
        let groupWrap = document.createElement("div");
        groupWrap.setAttribute("class", classes.userGroupHeaderWrap);
        groupWrap.appendChild(document.createTextNode(divisionName));
        return groupWrap;
    };

    const initData = async () => {
        createTableViaTabulator("#usersTable", usersColumns, [], () => {}, true, customGroupHeader);
        const currentUserData: ICurrentUserDtoViewModel = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            const companyName = currentUserData.company.nameRu;

            setCompanyId(companyId);
            setCompanyName(companyName);
            const userData: IUsersDtoViewModel[] = await actionMethodResultSync(
                "USER",
                `user?companyId=${companyId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);

            setTableData(userData);

            const userDataWithPhoto = await getUsersWithPhotoId(userData);

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

    const getUsersWithPhotoId = async (data: IUsersDtoViewModel[]) => {
        const usersWithPhotoId = [];
        for (let i = 0; i < data.length; ++i) {
            const profilePhotoId = data[i].profilePhotoId;
            let currentUserPhotoId;
            if (profilePhotoId) {
                currentUserPhotoId = await actionMethodResultSync(
                    "FILE",
                    `file/download/${profilePhotoId}/base64`,
                    "get"
                )
                    .then((res) => res)
                    .catch(() => undefined);
            }

            usersWithPhotoId.push({ ...data[i], currentUserPhotoId });
        }

        return usersWithPhotoId;
    };

    const handleFioClick = (e: UIEvent, row: Tabulator.RowComponent) =>
        navigate(`/users/${row.getData()?.userId}`);

    const onFinishCreatingUser = (data: any) => {
        table?.addData(data);
        table?.redraw(true);
    };

    const handleFiltrationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

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
                <Col className={classes.searchingCol}>
                    <Button
                        className={classes.button}
                        customType={"regular"}
                        icon={<PlusOutlined />}
                        onClick={showDrawer}
                    >
                        Добавить нового сотрудника
                    </Button>
                </Col>
            </Row>
            <Row className={classes.usersTableWrapper}>
                <div id="usersTable" />
            </Row>
            <UserAddDrawer
                companyId={companyId}
                open={isVisibleAddUserDrawer}
                setOpen={setIsVisibleAddUserDrawer}
                companyName={companyName}
                onFinishCreatingUser={onFinishCreatingUser}
            />
        </Row>
    );
};
export default Users;
