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
        initData();
    }, [searchStr, requestType, sortType]);

    const { getCurrentUserData } = useSimpleHttpFunctions();

    const fullNameTableActionsFormatter = (cell: Tabulator.CellComponent) => {
        const data: any = cell.getData();

        const userPhoto = data.currentExternalUserPhotoId;

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

            const searchedExternalUserData = externalUserData.filter((userItem: any) => {
                const tableDataStr =
                    (userItem.lastname || "") +
                    (userItem.firstname || "") +
                    (userItem.patronymic || "") +
                    (userItem.personalContact?.email || "") +
                    (userItem.personalContact?.mobilePhoneNumber || "") +
                    (userItem.counterparty?.nameRu || "") +
                    (userItem.position?.nameRu || "");
                return tableDataStr.toLowerCase().includes(searchStr.toLowerCase());
            });

            const externalUsersDataWithPhoto: IExternalUsersDataModel[] =
                await getExternalUsersWithPhotoId(searchedExternalUserData);

            const sortedExternalUsersDataWithPhoto = getSortedData(
                externalUsersDataWithPhoto,
                sortType
            );

            const actionsSell: ColumnDefinition = {
                headerSort: false,
                title: "ФИО",
                field: "fullName",
                formatter: fullNameTableActionsFormatter
            };

            await setTable(
                createTableViaTabulator(
                    "#externalUsersTable",
                    [actionsSell, ...externalUsersColumns],
                    sortedExternalUsersDataWithPhoto,
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

    const getExternalUsersWithPhotoId = async (data: IExternalUsersDtoViewModel[]) => {
        const externalUsersWithPhotoId = [];
        for (let i = 0; i < data.length; ++i) {
            const profilePhotoId = data[i].profilePhotoId;
            let currentExternalUserPhotoId: string | undefined;
            if (profilePhotoId) {
                currentExternalUserPhotoId = await actionMethodResultSync(
                    "FILE",
                    `file/download/${profilePhotoId}/base64`,
                    "get"
                )
                    .then((res) => res)
                    .catch(() => undefined);
            }

            externalUsersWithPhotoId.push({ ...data[i], currentExternalUserPhotoId });
        }

        return externalUsersWithPhotoId;
    };

    const getDataWithPhoto = async (data: IExternalUsersDtoViewModel) => {
        if (data && data.profilePhotoId) {
            const externalUserPhotoId = await actionMethodResultSync(
                "FILE",
                `file/download/${data.profilePhotoId}/base64`,
                "get"
            )
                .then((res) => res)
                .catch(() => undefined);
            if (externalUserPhotoId) {
                return { ...data, currentExternalUserPhotoId: externalUserPhotoId };
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
