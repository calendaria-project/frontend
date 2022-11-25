import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import cx from "classnames";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { Row, Col, Select, Typography, Input, Form, message } from "antd";
import { requestTypeValues, ALL, DATE, sortTypeValues } from "./defaultValues";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "ui/Button";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import { AuthContext } from "context/AuthContextProvider";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import questionImage from "assets/icons/question.png";
import { createTableViaTabulator } from "services/tabulator";
import { externalUsersColumns } from "data/columns";
import { ColumnDefinition } from "tabulator-tables";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import ExternalUserDrawer from "./externalUserDrawer";
import {
    ICurrentUserDtoViewModel,
    IExternalUsersDataModel,
    IExternalUsersDtoViewModel
} from "interfaces";
import SharedExternalUserModal from "./modal/SharedExternalUserModal";
import { removeEmptyValuesFromAnyLevelObject } from "utils/removeObjectProperties";
import { parsePointObjectKey } from "utils/parsePointObjectKey";
import getSortedData from "./getSortedData";
import getFullName from "utils/getFullName";

const { Option } = Select;
const { Text } = Typography;

export interface IFinishData {
    firstname: string;
    lastname: string;
    patronymic?: string;
    "position.positionId": number;
    "counterparty.companyId": number;
    "personalContact.email"?: string;
    "personalContact.mobilePhoneNumber": string;
    profilePhotoId?: string;
}

const ExternalUsers: FC = () => {
    const dispatch = useDispatch();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [form] = Form.useForm();
    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [table, setTable] = useState<Tabulator | undefined>();
    const [tableData, setTableData] = useState<IExternalUsersDataModel[]>([]);
    const [currentExternalUserInfo, setCurrentExternalUserInfo] = useState<IExternalUsersDataModel>(
        {} as IExternalUsersDataModel
    );
    const [externalUserDrawerOpen, setExternalUserDrawerOpen] = useState(false);

    const [addExternalUserModalVisible, setAddExternalUserModalVisible] = useState(false);

    const [requestType, setRequestType] = useState(
        sessionStorage.getItem("externalUserReqType") || ALL
    );

    useEffect(() => {
        sessionStorage.setItem("externalUserReqType", requestType);
    }, [requestType]);

    const onChangeRequestType = useCallback((v: string) => setRequestType(v), []);

    const [sortType, setSortType] = useState(
        sessionStorage.getItem("externalUserSortType") || DATE
    );

    useEffect(() => {
        sessionStorage.setItem("externalUserSortType", sortType);
    }, [sortType]);

    const onChangeSortType = useCallback((v: string) => setSortType(v), []);

    const [query, setQuery] = useState("");
    const { searchStr } = useDelayedInputSearch(query);

    const handleFiltrationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.externalUsers));
    }, []);

    useEffect(() => {
        const searchedTableData = tableData.filter((tableItem) => {
            const tableDataStr =
                getFullName(tableItem.firstname, tableItem.lastname, tableItem.patronymic) +
                (tableItem.personalContact?.email || "") +
                (tableItem.personalContact?.mobilePhoneNumber || "") +
                (tableItem.counterparty?.nameRu || "") +
                (tableItem.position?.nameRu || "");
            return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
        });

        const sortedAndSearchedTableData = getSortedData(searchedTableData, sortType);

        table?.replaceData(sortedAndSearchedTableData);
        table?.redraw(true);
    }, [searchStr, sortType]);

    useEffect(() => {
        initData();
    }, [requestType]);

    const { getCurrentUserData, getUsersWithPhotoId } = useSimpleHttpFunctions();

    const fullNameTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        const data: any = cell.getData();

        const userPhoto = data.currentPhotoId;

        let photoElement = document.createElement("img");
        photoElement.setAttribute("src", userPhoto ? userPhoto : questionImage);
        photoElement.setAttribute("class", classes.externalUserPhoto);
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
        createTableViaTabulator("#externalUsersTable", externalUsersColumns, [], () => {}, true);
        const currentUserData: ICurrentUserDtoViewModel = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            setCompanyId(companyId);
            const externalUserData: IExternalUsersDtoViewModel[] = await actionMethodResultSync(
                "USER",
                `user/external?companyId=${companyId}&requestType=${requestType}`,
                "get",
                getRequestHeader(authContext.token)
            ).then((data) => data);

            const externalUsersDataWithPhoto: IExternalUsersDataModel[] = await getUsersWithPhotoId(
                externalUserData
            );

            const initialSortedExternalUsersDataWithPhoto = getSortedData(
                externalUsersDataWithPhoto,
                sortType
            );

            const actionsSell: ColumnDefinition = {
                headerSort: false,
                title: "ФИО",
                field: "fullName",
                formatter: fullNameTableActionsFormatter
            };

            setTableData(initialSortedExternalUsersDataWithPhoto);

            await setTable(
                createTableViaTabulator(
                    "#externalUsersTable",
                    [actionsSell, ...externalUsersColumns],
                    initialSortedExternalUsersDataWithPhoto,
                    handleFioClick,
                    undefined
                )
            );
        }
    };

    const handleFioClick = (e: UIEvent, row: Tabulator.RowComponent) => {
        setCurrentExternalUserInfo(row.getData());
        setExternalUserDrawerOpen(true);
    };

    const getDataWithPhoto = async (data: IExternalUsersDtoViewModel) => {
        if (data && data.profilePhotoId) {
            const currentPhotoId = await actionMethodResultSync(
                "FILE",
                `file/download/${data.profilePhotoId}/base64`,
                "get"
            )
                .then((res) => res)
                .catch(() => undefined);
            if (currentPhotoId) {
                return { ...data, currentPhotoId };
            }
        }
        return data;
    };

    const onFinishAddExternalUser = useCallback(
        async (data: IFinishData) => {
            if (companyId) {
                let currentData = parsePointObjectKey(
                    removeEmptyValuesFromAnyLevelObject(data),
                    companyId + "",
                    form
                );
                const newData: IExternalUsersDtoViewModel = await actionMethodResultSync(
                    "USER",
                    `user/external`,
                    "post",
                    getRequestHeader(authContext.token),
                    currentData
                )
                    .then((res) => res)
                    .catch(() => message.error("Ошибка!"));
                const dataWithPhoto = await getDataWithPhoto(newData);
                table?.addData([dataWithPhoto]);
                table?.redraw(true);
                message.success("Успешно добавлено!");
                setAddExternalUserModalVisible(false);
                form.resetFields();
            }
        },
        [table, form, companyId]
    );

    return (
        <Row className={classes.wrapper}>
            <Row align={"middle"} justify={"space-between"} className={classes.selectionRow}>
                <Col>
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
                    <Text className={classes.sortText}>Сортировать по:</Text>
                    <Select
                        className={cx(classes.select, classes.sortSelect)}
                        value={sortType}
                        onChange={onChangeSortType}
                    >
                        {sortTypeValues.map(({ type, label }) => (
                            <Option value={type} key={type}>
                                {label}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Input
                        className={classes.input}
                        onChange={handleFiltrationChange}
                        placeholder="Поиск"
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                    <Button
                        onClick={() => setAddExternalUserModalVisible(true)}
                        className={classes.btn}
                        customType={"regular"}
                        icon={<PlusOutlined />}
                    >
                        Добавить
                    </Button>
                </Col>
            </Row>
            <Row className={classes.externalUsersTableWrap}>
                <div id="externalUsersTable" />
            </Row>
            <ExternalUserDrawer
                requestType={requestType}
                table={table}
                open={externalUserDrawerOpen}
                setOpen={setExternalUserDrawerOpen}
                externalUserData={currentExternalUserInfo}
            />
            <SharedExternalUserModal
                okText={"Добавить"}
                title={"Добавить внешнего пользователя"}
                setIsVisible={setAddExternalUserModalVisible}
                onFinish={onFinishAddExternalUser}
                isVisible={addExternalUserModalVisible}
                form={form}
            />
        </Row>
    );
};
export default ExternalUsers;
