import React, { FC, useState, useEffect, memo, useMemo, useCallback, useContext } from "react";
import { Row, Col, Divider, Typography, Form, message } from "antd";
import { TInputData, Types } from "../constants";
import { SelectedKeyTypes } from "../constants";

import _ from "lodash";

import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import {
    IUsersAddressInfoModel,
    IUsersContractModel,
    IUsersDocumentModel,
    IUsersEducationModel,
    IUsersInventoryModel,
    IUsersLanguageKnowledgeModel,
    IUsersRelationshipModel
} from "interfaces";
import { EditOutlined } from "@ant-design/icons";

import UserExtraCardModal from "../modal";
import { getUserEditingNameByKey } from "utils/getUserEditingNameByKey";
import { actionMethodResultSync } from "functions/actionMethodResult";
import getUserRequestUrl from "functions/getUserRequestUrl";
import { getRequestHeader } from "functions/common";
import { SetCurrentUserDataItemInfo } from "store/actions";
import { removeEmptyObjectProperties } from "utils/removeObjectProperties";
import { AuthContext } from "context/AuthContextProvider";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";

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

    const [form] = Form.useForm();
    const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
    const [modalVisibleFlag, setModalVisibleFlag] = useState<boolean>(false);

    const handleIconClick = useCallback(
        (index: number) => () => {
            setCurrentItemIndex(index);
            setModalVisibleFlag(true);
        },
        []
    );

    const saveModal = useCallback(
        (record: any) => {
            const recordWithDates = getObjectWithHandledDates(record);
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
                _.merge(currentUserDataItemInfo[currentItemIndex], recordWithDates)
            );
            sendRequest(data);

            setModalVisibleFlag(false);
            form.resetFields();
        },
        [currentUserDataItemInfo, currentSelectedKey, usersId, currentItemIndex]
    );

    const additionalModalTitle = useMemo(
        () => `Редактировать ${getUserEditingNameByKey(currentSelectedKey)}`,
        [currentSelectedKey]
    );

    const ListItem: FC<{
        index: number;
        title: string | undefined;
        extraTitle?: string | undefined;
        additionalInfo: string | undefined;
        additionalInfoExtraColor?: boolean | undefined;
        extraAdditionalInfo?: string | number | undefined;
    }> = ({
        index,
        title,
        extraTitle,
        additionalInfo,
        additionalInfoExtraColor,
        extraAdditionalInfo
    }) => {
        const theme = useTheme<ITheme>();
        // @ts-ignore
        const classes = useStyles({ theme, additionalInfoExtraColor });

        return (
            <Form key={index} form={form} component={false}>
                <Row className={classes.rowWrapper}>
                    <Col>
                        <Text strong>{title || ""}</Text>
                    </Col>
                    <Col className={classes.endedColWrapper}>
                        <EditOutlined onClick={handleIconClick(index)} className={classes.icon} />
                    </Col>
                </Row>
                {extraTitle && (
                    <Row className={classes.rowWrapper}>
                        <Col>
                            <Text>{extraTitle || ""}</Text>
                        </Col>
                    </Row>
                )}
                <Row className={classes.rowWrapper}>
                    <Col>
                        <Text className={classes.additionalInfo}>{additionalInfo || ""}</Text>
                    </Col>
                    {extraAdditionalInfo && (
                        <Col className={classes.endedColWrapper}>
                            <Text className={classes.extraInfo}>{extraAdditionalInfo}</Text>
                        </Col>
                    )}
                </Row>
                <Divider />
                <UserExtraCardModal
                    okText={"Сохранить"}
                    title={additionalModalTitle}
                    isVisible={modalVisibleFlag}
                    setIsVisible={setModalVisibleFlag}
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
                                  key={"" + index + dataInfo.contractType?.nameRu}
                                  index={index}
                                  title={dataInfo.contractType?.nameRu}
                                  additionalInfo={dataInfo.contractNum}
                                  extraAdditionalInfo={dataInfo.contractDate}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.DOCUMENT
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersDocumentModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.documentType?.nameRu}
                                  index={index}
                                  title={dataInfo.documentType?.nameRu}
                                  additionalInfo={dataInfo.issueAuthority?.nameRu}
                                  extraAdditionalInfo={dataInfo.documentNum}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.INVENTORY
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersInventoryModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.inventoryType?.nameRu}
                                  index={index}
                                  title={dataInfo.inventoryType?.nameRu}
                                  additionalInfo={dataInfo.serialNum}
                                  extraAdditionalInfo={dataInfo.modelNum}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.EDUCATION
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersEducationModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.institution?.nameRu}
                                  index={index}
                                  title={dataInfo.institution?.nameRu}
                                  additionalInfo={dataInfo.educationLevel?.nameRu}
                                  extraAdditionalInfo={dataInfo.endYear}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.LANGUAGE_KNOWLEDGE
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersLanguageKnowledgeModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.language?.nameRu}
                                  index={index}
                                  title={dataInfo.language?.nameRu}
                                  additionalInfo={dataInfo.knowledgeLevel?.nameRu}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.ADDRESS_INFO
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersAddressInfoModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.addressType?.nameRu}
                                  index={index}
                                  title={dataInfo.addressType?.nameRu}
                                  additionalInfo={dataInfo.city?.nameRu}
                                  extraAdditionalInfo={dataInfo.street}
                              />
                          )
                      )
                    : currentSelectedKey === SelectedKeyTypes.RELATIONSHIP
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IUsersRelationshipModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.relationshipType?.nameRu}
                                  index={index}
                                  title={dataInfo.relationshipType?.nameRu}
                                  extraTitle={`${dataInfo.lastname || ""} ${
                                      dataInfo.firstname || ""
                                  } ${dataInfo.patronymic || ""}`}
                                  additionalInfo={`Пол: ${dataInfo.sex?.nameRu || ""}`}
                                  additionalInfoExtraColor={true}
                                  extraAdditionalInfo={dataInfo.birthDate}
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
    const classes = useStyles();

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
        <Row className={classes.rowWrapper}>
            <Col>{dataItem.placeholder}</Col>
            <Col className={classes.endedColWrapper}>{userMenuDataExists ? displayedData : ""}</Col>
            <Divider />
        </Row>
    );
};
export default memo(RowData);
