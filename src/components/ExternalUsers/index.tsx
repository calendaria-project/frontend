import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import cx from "classnames";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { Row, Col, Select, Typography, Input, Form } from "antd";
import { requestTypeValues, ALL } from "./defaultValues";
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

const { Option } = Select;
const { Text } = Typography;

const ExternalUsers: FC = () => {
    const dispatch = useDispatch();
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const [form] = Form.useForm();
    const [table, setTable] = useState<Tabulator | undefined>();

    const [requestType, setRequestType] = useState(ALL);
    const onChangeRequestType = useCallback((v: string) => setRequestType(v), []);

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
    }, [searchStr, requestType]);

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
        const currentUserData: any = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            const externalUserData = await actionMethodResultSync(
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

            const externalUsersDataWithPhoto = await getExternalUsersWithPhotoId(
                searchedExternalUserData
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
                    externalUsersDataWithPhoto,
                    handleFioClick,
                    undefined
                )
            );
        }
    };

    const handleFioClick = (e: UIEvent, row: Tabulator.RowComponent) => {
        console.log(row);
    };

    const getExternalUsersWithPhotoId = async (data: any) => {
        const externalUsersWithPhotoId = [];
        for (let i = 0; i < data.length; ++i) {
            const profilePhotoId = data[i].profilePhotoId;
            let currentExternalUserPhotoId;
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
                        value={"creationDate"}
                    >
                        {<Option value={"creationDate"}>Дате создания</Option>}
                    </Select>
                </Col>
                <Col>
                    <Input
                        className={classes.input}
                        onChange={handleFiltrationChange}
                        placeholder="Поиск"
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                    <Button className={classes.btn} customType={"regular"} icon={<PlusOutlined />}>
                        Добавить
                    </Button>
                </Col>
            </Row>
            <Row className={classes.externalUsersTableWrap}>
                {/*<Form form={form} component={false}>*/}
                {/*    */}
                {/*</Form>*/}
                <div id="externalUsersTable" />
            </Row>
        </Row>
    );
};
export default ExternalUsers;
