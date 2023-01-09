import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { accessItemRequestTranscripts, mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import { Col, Input, Row, Select, Typography, Menu, Dropdown, Space, Button } from "antd";

import useStyles from "./styles";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";
import {
    IAccessAppDataByCurrentUserInKeyViewModel,
    IAccessAppDataByCurrentUserViewModel
} from "interfaces";
import { SearchOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { BOOKING, OUTGOING, selectReqValues } from "./defaultValues";
import { ALL_BOOKINGS, DATE, sortAccessReqValues, sortAccessShowValues } from "data/constants";
import cx from "classnames";
import ReqTable from "./ReqTable";
import Spinner from "ui/Spinner";
import { ITheme } from "styles/theme/interface";
import useDelayedInputSearch from "hooks/useDelayedInputSearch";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";

import { appTypesEnumTranscripts } from "data/enums";
import sortRequests from "utils/sortAccessRequests";
import getFullName from "utils/getFullName";

const { Option } = Select;
const { Text } = Typography;

const Requests: FC = () => {
    const dispatch = useDispatch();

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.requests));
    }, []);

    const [allRequests, setAllRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [copiedRequests, setCopiedRequests] = useState<IAccessAppDataByCurrentUserViewModel>(
        {} as IAccessAppDataByCurrentUserViewModel
    );
    const [loadingRequests, setLoadingRequests] = useState(false);

    const [selectReqValue, setSelectReqValue] = useState(
        sessionStorage.getItem("selectHeadRequestsValue") || OUTGOING
    );
    const [sortValue, setSortValue] = useState("");

    const isBooking = selectReqValue === BOOKING;

    const [query, setQuery] = useState("");
    const { searchStr, handleFiltrationChange } = useDelayedInputSearch(query, setQuery);
    const { getOutgoingAccessApplication, getIncomingAccessApplication, getUsersWithPhotoId } =
        useSimpleHttpFunctions();

    useEffect(() => {
        !isBooking
            ? setSortValue(sessionStorage.getItem("sortHeadRequestsValue") || DATE)
            : setSortValue(sessionStorage.getItem("sortHeadShowValue") || ALL_BOOKINGS);
    }, [isBooking]);

    useEffect(() => {
        initReqData();
    }, [isBooking, selectReqValue]);

    const initReqData = async () => {
        if (!isBooking) {
            setLoadingRequests(true);
            const data: IAccessAppDataByCurrentUserViewModel =
                selectReqValue === OUTGOING
                    ? await getOutgoingAccessApplication()
                    : await getIncomingAccessApplication();

            const newData: [string, IAccessAppDataByCurrentUserInKeyViewModel[]][] =
                await Promise.all(
                    Object.entries(data || {}).map(async ([key, allReqsInKey]) => {
                        const reqs = await Promise.all(
                            allReqsInKey.map(async (req) => {
                                const modifiedReq = await getUsersWithPhotoId([
                                    req.applicationUser
                                ]);
                                return { ...req, applicationUser: modifiedReq[0] };
                            })
                        );
                        return [key, reqs];
                    })
                );

            const formattedData: IAccessAppDataByCurrentUserViewModel = Object.fromEntries(newData);

            setLoadingRequests(false);
            setAllRequests(formattedData ?? {});
            setCopiedRequests(formattedData ?? {});
        }
    };

    useEffect(() => {
        if (!isBooking && isObjectNotEmpty(copiedRequests)) {
            const searchedData: [string, IAccessAppDataByCurrentUserInKeyViewModel[]][] = searchStr
                ? Object.entries(copiedRequests).map(([key, allReqsInKey]) => {
                      return [
                          key,
                          allReqsInKey.filter((req) => {
                              const reqDataStr =
                                  getFullName(
                                      req.applicationUser?.firstname,
                                      req.applicationUser?.lastname,
                                      req.applicationUser?.patronymic
                                  ) +
                                  (appTypesEnumTranscripts[req.appType] || "") +
                                  (new Date(req.createdAt).toLocaleDateString("ru-RU") || "") +
                                  (new Date(req.endDate).toLocaleDateString("ru-RU") || "") +
                                  (accessItemRequestTranscripts[req.items?.[0]?.status] || "");
                              return reqDataStr.toLowerCase().includes(searchStr.toLowerCase());
                          })
                      ];
                  })
                : Object.entries(copiedRequests);
            const searchedAndSortedData = sortRequests(sortValue, searchedData);
            setAllRequests(Object.fromEntries(searchedAndSortedData));
        }
    }, [searchStr, isBooking, copiedRequests, sortValue]);

    const handleChangeSelectReqValue = useCallback((v: string) => {
        sessionStorage.setItem("selectHeadRequestsValue", v);
        setSelectReqValue(v);
    }, []);

    const handleChangeSortValue = useCallback(
        (v: string) => {
            if (!isBooking) {
                sessionStorage.setItem("sortHeadRequestsValue", v);
            } else {
                sessionStorage.setItem("sortHeadShowValue", v);
            }
            setSortValue(v);
        },
        [isBooking]
    );

    const dropdownItems = useMemo(
        () => (
            <Menu
                items={[
                    {
                        key: "1",
                        label: <span onClick={() => {}}>Заявка на предоставление доступа</span>
                    },
                    {
                        key: "2",
                        label: <span onClick={() => {}}>Заявка на удаление доступа</span>
                    }
                ]}
            />
        ),
        []
    );

    return (
        <Row className={classes.wrapper}>
            <Row align={"middle"} justify={"space-between"} className={classes.selectionRow}>
                <Col>
                    <Select
                        className={classes.select}
                        value={selectReqValue}
                        onChange={handleChangeSelectReqValue}
                    >
                        {(selectReqValues || []).map(({ value, label }) => (
                            <Option key={value + label} value={value}>
                                {label}
                            </Option>
                        ))}
                    </Select>
                    <Text className={classes.textForSelection}>
                        {!isBooking ? "Сортировать по:" : "Показать:"}
                    </Text>
                    <Select
                        className={cx(classes.select, classes.sortSelect)}
                        value={sortValue}
                        onChange={handleChangeSortValue}
                    >
                        {(!isBooking ? sortAccessReqValues : sortAccessShowValues).map(
                            ({ value, label }) => (
                                <Option value={value} key={value + label}>
                                    {label}
                                </Option>
                            )
                        )}
                    </Select>
                </Col>
                <Col>
                    <Input
                        className={classes.input}
                        placeholder="Поиск"
                        onChange={handleFiltrationChange}
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                    {!isBooking ? (
                        <Dropdown overlay={dropdownItems}>
                            <Button className={classes.btn}>
                                <Space>
                                    Создать
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Button className={classes.btn} icon={<PlusOutlined />}>
                            Добавить
                        </Button>
                    )}
                </Col>
            </Row>
            {!isBooking ? (
                loadingRequests ? (
                    <div className={classes.loadIconWrap}>
                        <Spinner style={{ color: theme.color.regular + "" }} />
                    </div>
                ) : (
                    <ReqTable reqData={allRequests} setReqData={setAllRequests} />
                )
            ) : (
                <></>
            )}
        </Row>
    );
};
export default Requests;
