import React, {
    FC,
    useState,
    useEffect,
    memo,
    useMemo,
    useCallback,
    useContext,
    Suspense
} from "react";
import { Row, Col, Divider, Typography, Form, message, FormInstance } from "antd";
import { TLayoutModalData } from "data/types";
import { selectedKeyTypes, layoutConstantTypes } from "data/enums";
import fileDownload from "js-file-download";

import _ from "lodash";

import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo, getSelectedKey } from "store/reducers/userReducer";
import {
    IAddressInfoViewModel,
    IContractViewModel,
    IDocumentViewModel,
    IEducationViewModel,
    IInventoryViewModel,
    ILanguageKnowledgeViewModel,
    IRelationshipViewModel
} from "interfaces";
import { EditOutlined, DownloadOutlined } from "@ant-design/icons";

import { getModalEditingNameByKey } from "utils/getModalEditingNameByKey";
import { actionMethodResultSync } from "http/actionMethodResult";
import getUserRequestUrl from "utils/getUserRequestUrl";
import { getFileRequestHeader, getRequestHeader } from "http/common";
import { SetCurrentUserDataItemInfo } from "store/actions";
import { removeEmptyObjectProperties } from "utils/removeObjectProperties";
import { AuthContext } from "context/AuthContextProvider";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import getObjectWithHandledDates from "utils/getObjectWithHandeledDates";

const UserExtraCardModal = React.lazy(() => import("../modal"));

const { Text } = Typography;

const ListItem: FC<{
    onClick: (index: number) => () => void;
    onDownload?: (index: number) => () => void;
    form: FormInstance;
    index: number;
    title: string | undefined;
    extraTitle?: string | undefined;
    additionalInfo: string | undefined;
    additionalInfoExtraColor?: boolean | undefined;
    extraAdditionalInfo?: string | number | undefined;
}> = ({
    onClick,
    onDownload,
    form,
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
                    {onDownload ? (
                        <>
                            <EditOutlined onClick={onClick(index)} className={classes.editIcon} />
                            <DownloadOutlined
                                onClick={onDownload(index)}
                                className={classes.downloadIcon}
                            />
                        </>
                    ) : (
                        <EditOutlined onClick={onClick(index)} className={classes.icon} />
                    )}
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
        </Form>
    );
};

const ListRowData: FC<{
    currentDataLayout: TLayoutModalData[];
    usersId: string;
}> = ({ currentDataLayout, usersId }) => {
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();

    const userFio = useTypedSelector((state) => state.user.currentUserFio);
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );
    const currentSelectedKey = useTypedSelector((state) => getSelectedKey(state.user));
    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);

    const [form] = Form.useForm();
    const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
    const [modalVisibleFlag, setModalVisibleFlag] = useState<boolean>(false);

    const onIconClick = useCallback(
        (index: number) => () => {
            setCurrentItemIndex(index);
            setModalVisibleFlag(true);
        },
        []
    );

    const onDownloadClick = useCallback(
        (index: number) => () => {
            if (userMenuDataExists) {
                let contract: IContractViewModel = {} as IContractViewModel;
                currentUserDataItemInfo.forEach((item: IContractViewModel, itemIndex: number) => {
                    if (index === itemIndex) {
                        contract = item;
                    }
                });
                if (contract && contract.contractId) {
                    actionMethodResultSync(
                        "USER",
                        `contract/export/${contract.contractId}`,
                        "get",
                        getFileRequestHeader(authContext.token)
                    )
                        .then((res) =>
                            fileDownload(
                                res,
                                `${userFio} - ${contract.contractType?.nameRu || ""}.docx`
                            )
                        )
                        .catch(() => message.error("Ошибка скачивания договора"));
                }
            }
        },
        [currentUserDataItemInfo, userMenuDataExists]
    );

    const saveModal = useCallback(
        (record: any) => {
            const recordWithDates = getObjectWithHandledDates(record);
            const { salaryConstantPart, salaryVariablePart, ...modifiedRecord } = recordWithDates;
            const reqMethod = "put";

            console.log("RECORD", modifiedRecord);

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

            const currentInfo: any = currentUserDataItemInfo?.[currentItemIndex] || {};
            const data = removeEmptyObjectProperties(
                modifiedRecord.formTypes
                    ? {
                          ...modifiedRecord,
                          contractId: currentInfo.contractId,
                          createdAt: currentInfo.createdAt,
                          updatedAt: currentInfo.updatedAt,
                          userId: currentInfo.userId
                      }
                    : _.merge(currentInfo, modifiedRecord)
            );
            console.log("DATA", data);

            sendRequest(data);

            setModalVisibleFlag(false);
            form.resetFields();
        },
        [currentUserDataItemInfo, currentSelectedKey, usersId, currentItemIndex]
    );

    const additionalModalTitle = useMemo(
        () => `Редактировать ${getModalEditingNameByKey(currentSelectedKey)}`,
        [currentSelectedKey]
    );

    return (
        <>
            {userMenuDataExists &&
                (currentSelectedKey === selectedKeyTypes.CONTRACT
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IContractViewModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.contractType?.nameRu}
                                  onClick={onIconClick}
                                  form={form}
                                  index={index}
                                  title={dataInfo.contractType?.nameRu}
                                  additionalInfo={dataInfo.contractNum}
                                  extraAdditionalInfo={dataInfo.contractDate}
                                  onDownload={onDownloadClick}
                              />
                          )
                      )
                    : currentSelectedKey === selectedKeyTypes.DOCUMENT
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IDocumentViewModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.documentType?.nameRu}
                                  onClick={onIconClick}
                                  form={form}
                                  index={index}
                                  title={dataInfo.documentType?.nameRu}
                                  additionalInfo={dataInfo.issueAuthority?.nameRu}
                                  extraAdditionalInfo={dataInfo.documentNum}
                              />
                          )
                      )
                    : currentSelectedKey === selectedKeyTypes.INVENTORY
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IInventoryViewModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.inventoryType?.nameRu}
                                  onClick={onIconClick}
                                  form={form}
                                  index={index}
                                  title={dataInfo.inventoryType?.nameRu}
                                  additionalInfo={dataInfo.serialNum}
                                  extraAdditionalInfo={dataInfo.modelNum}
                              />
                          )
                      )
                    : currentSelectedKey === selectedKeyTypes.EDUCATION
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IEducationViewModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.institution?.nameRu}
                                  onClick={onIconClick}
                                  form={form}
                                  index={index}
                                  title={dataInfo.institution?.nameRu}
                                  additionalInfo={dataInfo.educationLevel?.nameRu}
                                  extraAdditionalInfo={dataInfo.endYear}
                              />
                          )
                      )
                    : currentSelectedKey === selectedKeyTypes.LANGUAGE_KNOWLEDGE
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: ILanguageKnowledgeViewModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.language?.nameRu}
                                  onClick={onIconClick}
                                  form={form}
                                  index={index}
                                  title={dataInfo.language?.nameRu}
                                  additionalInfo={dataInfo.knowledgeLevel?.nameRu}
                              />
                          )
                      )
                    : currentSelectedKey === selectedKeyTypes.ADDRESS_INFO
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IAddressInfoViewModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.addressType?.nameRu}
                                  onClick={onIconClick}
                                  form={form}
                                  index={index}
                                  title={dataInfo.addressType?.nameRu}
                                  additionalInfo={dataInfo.city?.nameRu}
                                  extraAdditionalInfo={dataInfo.street}
                              />
                          )
                      )
                    : currentSelectedKey === selectedKeyTypes.RELATIONSHIP
                    ? (currentUserDataItemInfo || []).map(
                          (dataInfo: IRelationshipViewModel, index: number) => (
                              <ListItem
                                  key={"" + index + dataInfo.relationshipType?.nameRu}
                                  onClick={onIconClick}
                                  form={form}
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
            <Suspense>
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
            </Suspense>
        </>
    );
};
const ListedRowData = React.memo(ListRowData);
export { ListedRowData };

const RowData: FC<{ dataItem: TLayoutModalData }> = ({ dataItem }) => {
    const classes = useStyles();

    const [displayedData, setDisplayedData] = useState<string>("");
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );
    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);

    useEffect(() => {
        if (dataItem.type === layoutConstantTypes.SELECT) {
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
