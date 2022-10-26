import React, { FC, useState, useEffect, memo, useMemo, useCallback, useContext } from "react";
import { Row, Col, Divider, Typography, Form, message } from "antd";
import { TInputData, Types } from "./constants";
import { SelectedKeyTypes } from "./constants";

import _ from "lodash";

import "./styles.scss";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import {
    IUsersContractModel,
    IUsersDocumentModel,
    IUsersEducationModel,
    IUsersInventoryModel,
    IUsersLanguageKnowledgeModel
} from "interfaces";
import { EditOutlined } from "@ant-design/icons";

import UserExtraCardModal from "./modal";
import { getUserEditingNameByKey } from "utils/getUserEditingNameByKey";
import { actionMethodResultSync } from "functions/actionMethodResult";
import getUserRequestUrl from "functions/getUserRequestUrl";
import { getRequestHeader } from "functions/common";
import { SetCurrentUserDataItemInfo } from "store/actions";
import { removeEmptyObjectProperties } from "utils/removeEmptyObjectProperties";
import { AuthContext } from "context/AuthContextProvider";
import { useDispatch } from "react-redux";

interface IRowData {
    dataItem: TInputData;
}

interface IListRowData {
    currentDataLayout: Array<TInputData>;
    usersId: string;
}

const { Text } = Typography;

const ListRowData: FC<IListRowData> = ({ currentDataLayout, usersId }) => {
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();

    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );
    const currentSelectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);

    const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);

    const [modalVisibleFlag, setModalVisibleFlag] = useState<boolean>(false);

    const additionalModalTitle = useMemo(
        () => `Редактировать ${getUserEditingNameByKey(currentSelectedKey)}`,
        [currentSelectedKey]
    );

    const onSetModalVisibleFlag = useCallback((bool: boolean) => {
        setModalVisibleFlag(bool);
    }, []);

    const handleIconClick = useCallback(
        (index: number) => () => {
            setCurrentItemIndex(index);
            setModalVisibleFlag(true);
        },
        []
    );

    const [form] = Form.useForm();

    const saveModal = useCallback(
        (record: any) => {
            if (record.issueDate) {
                record = {
                    ...record,
                    issueDate: record.issueDate._i
                };
            }
            if (record.contractDate) {
                record = {
                    ...record,
                    contractDate: record.contractDate._i
                };
            }

            const reqMethod = "put";
            const sendRequest = (data: Object) => {
                actionMethodResultSync(
                    "USER",
                    getUserRequestUrl(currentSelectedKey, reqMethod, usersId),
                    reqMethod,
                    getRequestHeader(authContext.token),
                    data
                )
                    .then((res) => {
                        const isDataExists = isObjectNotEmpty(currentUserDataItemInfo);
                        if (isDataExists) {
                            dispatch(
                                SetCurrentUserDataItemInfo({
                                    [currentSelectedKey]: currentUserDataItemInfo.map(
                                        (dataItem: any, index: number) =>
                                            index === currentItemIndex ? res : dataItem
                                    )
                                })
                            );
                        }
                        message.success("Успешно сохранено");
                    })
                    .catch((err) => {
                        console.log(err);
                        message.error("Ошибка");
                    });
            };

            const data = removeEmptyObjectProperties(
                _.merge(currentUserDataItemInfo[currentItemIndex], record)
            );
            sendRequest(data);

            setModalVisibleFlag(false);
        },
        [currentUserDataItemInfo, currentSelectedKey, usersId, currentItemIndex]
    );

    const ListItem: FC<{
        index: number;
        title: string;
        additionalInfo: string;
        extraAdditionalInfo?: string | number;
    }> = ({ index, title, additionalInfo, extraAdditionalInfo }) => {
        return (
            <Form key={index} form={form} component={false}>
                <Row className="row-wrapper">
                    <Col>
                        <Text strong>{title}</Text>
                    </Col>
                    <Col className="col-end-wrapper">
                        <EditOutlined
                            style={{ top: "4px" }}
                            onClick={handleIconClick(index)}
                            className="icon"
                        />
                    </Col>
                </Row>
                <Row className="row-wrapper">
                    <Col>{additionalInfo}</Col>
                    {extraAdditionalInfo && (
                        <Col className="col-end-wrapper">{extraAdditionalInfo}</Col>
                    )}
                </Row>
                <Divider className="userItem__extraCard-divider" />
                <UserExtraCardModal
                    okText={"Сохранить"}
                    title={additionalModalTitle}
                    isVisible={modalVisibleFlag}
                    setIsVisible={onSetModalVisibleFlag}
                    onFinish={saveModal}
                    form={form}
                    currentDataLayout={currentDataLayout}
                    index={currentItemIndex}
                />
            </Form>
        );
    };

    return (
        <>
            {userMenuDataExists &&
                (currentSelectedKey === SelectedKeyTypes.CONTRACT
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersContractModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.contractType.nameRu}
                                  index={index}
                                  title={dataInfo.contractType.nameRu}
                                  additionalInfo={dataInfo.contractNum}
                                  extraAdditionalInfo={dataInfo.contractDate}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.DOCUMENT
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersDocumentModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.documentType.nameRu}
                                  index={index}
                                  title={dataInfo.documentType.nameRu}
                                  additionalInfo={dataInfo.issueAuthority}
                                  extraAdditionalInfo={dataInfo.documentNum}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.INVENTORY
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersInventoryModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.inventoryType.nameRu}
                                  index={index}
                                  title={dataInfo.inventoryType.nameRu}
                                  additionalInfo={dataInfo.serialNum}
                                  extraAdditionalInfo={dataInfo.modelNum}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.EDUCATION
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersEducationModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.institution.nameRu}
                                  index={index}
                                  title={dataInfo.institution.nameRu}
                                  additionalInfo={dataInfo.educationLevel.nameRu}
                                  extraAdditionalInfo={dataInfo.endYear}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.LANGUAGE_KNOWLEDGE
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersLanguageKnowledgeModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.language.nameRu}
                                  index={index}
                                  title={dataInfo.language.nameRu}
                                  additionalInfo={dataInfo.knowledgeLevel.nameRu}
                              />
                          )
                      )
                    : null)}
        </>
    );
};

const ListedRowData = React.memo(ListRowData);
export { ListedRowData };

const RowData: FC<IRowData> = ({ dataItem }) => {
    const [displayedData, setDisplayedData] = useState<string>("");
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );
    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);

    useEffect(() => {
        if (dataItem.type === Types.SELECT) {
            setDisplayedData(currentUserDataItemInfo?.[dataItem.propertyName]?.nameRu);
        } else {
            setDisplayedData(currentUserDataItemInfo?.[dataItem.propertyName]);
        }
    }, [currentUserDataItemInfo, dataItem]);

    return (
        <Row className="row-wrapper">
            <Col>{dataItem.placeholder}</Col>
            <Col className="col-end-wrapper">{userMenuDataExists ? displayedData : ""}</Col>
            <Divider className="userItem__extraCard-divider" />
        </Row>
    );
};
export default memo(RowData);
