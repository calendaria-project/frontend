import React from "react";

import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row } from "antd";
import { FC, useContext, useEffect, useState } from "react";
import Header from "ui/Header";
import "./styles.scss";
import { AuthContext } from "context/AuthContextProvider";
import { usersColumns } from "data/columns";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { useNavigate } from "react-router";
import { createTableViaTabulator } from "services/tabulator";
import { UserDrawer, USER_ADD_DRAWER } from "./userDrawer";
import { ColumnDefinition } from "tabulator-tables";

import questionImage from "assets/icons/question.png";

const Users: FC = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [companyId, setCompanyId] = useState<string | undefined>();
    const [companyName, setCompanyName] = useState<string | undefined>();
    const [isVisibleAddUserDrawer, setIsVisibleAddUserDrawer] = useState(false);
    const [table, setTable] = useState<Tabulator | undefined>();

    useEffect(() => {
        initData();
    }, []);

    const fullNameTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        const data: any = cell.getData();

        const userPhoto = data.currentUserPhotoId;

        let photoElement = document.createElement("img");
        photoElement.setAttribute("src", userPhoto ? userPhoto : questionImage);
        photoElement.setAttribute("width", "30px");
        photoElement.setAttribute("height", "30px");

        let textElement = document.createElement("span");
        textElement.setAttribute("class", "fullNameText");
        textElement.textContent = `${data.lastname ?? ""} ${data.firstname ?? ""} ${
            data.patronymic ?? ""
        }`;

        let wrap = document.createElement("div");
        wrap.setAttribute("class", "fullNameWrap");
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
        groupWrap.setAttribute("class", "userGroupHeaderWrap");
        groupWrap.appendChild(document.createTextNode(divisionName));
        return groupWrap;
    };

    const initData = async () => {
        createTableViaTabulator("#usersTable", usersColumns, [], () => {}, true, customGroupHeader);
        const currentUserData: any = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            const companyName = currentUserData.company.nameRu;
            setCompanyId(companyId);
            setCompanyName(companyName);
            const userData = await actionMethodResultSync(
                "USER",
                `user?companyId=${companyId}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);

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

    const getCurrentUserData = () => {
        return actionMethodResultSync(
            "USER",
            "user/currentUser",
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => data);
    };

    const getUsersWithPhotoId = async (data: any) => {
        const usersWithPhotoId = [];
        for (let i = 0; i < data.length; ++i) {
            const profilePhotoId = data[i].profilePhotoId;
            let currentUserPhotoId;
            if (profilePhotoId) {
                currentUserPhotoId = await actionMethodResultSync(
                    "FILE",
                    `file/download/${profilePhotoId}`,
                    "get",
                    getRequestHeader(authContext.token)
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

    // const handleFiltrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setData(
    //         usersTableData.filter((dataItem) =>
    //             Object.values(dataItem).some((value) =>
    //                 (value + "").toLowerCase().includes(e.target.value.toLowerCase())
    //             )
    //         )
    //     );
    // };

    const showDrawer = () => setIsVisibleAddUserDrawer(true);

    return (
        <Row style={{ padding: "20px", marginRight: 0, marginLeft: 0 }} gutter={[16, 0]}>
            <Row style={{ marginRight: 0, marginLeft: 0, width: "100%" }} gutter={[16, 0]}>
                <Col>
                    <Header size="h2">Сотрудники</Header>
                </Col>
                <Col>
                    <Button
                        style={{ background: "#1890ff", color: "#fff", borderRadius: "6px" }}
                        icon={<PlusOutlined />}
                        onClick={showDrawer}
                    >
                        Добавить нового сотрудника
                    </Button>
                </Col>
                <Col>
                    <Input
                        style={{ width: 200, borderRadius: "6px" }}
                        // onChange={handleFiltrationChange}
                        placeholder="Поиск"
                        suffix={<SearchOutlined style={{ color: "#828282" }} />}
                    />
                </Col>
            </Row>
            <Row style={{ padding: "0 8px", marginRight: 0, marginLeft: 0, width: "100%" }}>
                <div id="usersTable" />
            </Row>
            <UserDrawer
                drawerType={USER_ADD_DRAWER}
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
