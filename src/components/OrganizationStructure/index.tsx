import React, { FC, useCallback, useContext, useEffect, useState, Suspense } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum, nodeTypeEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { Col, Dropdown, Form, message, Row, Space, Tree } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import {
    BranchesOutlined,
    ClusterOutlined,
    DragOutlined,
    EditOutlined,
    CrownOutlined,
    UserOutlined
} from "@ant-design/icons";
import {
    ICurrentUserDtoViewModel,
    IExtendedOrgStructureTreeItem,
    IOrgStructureTreeItem
} from "interfaces";
import { deletingOptions, layoutOptions, TLayoutOptions } from "./contants";
import getOrgStructureModalTitle from "utils/getOrgStructureModalTitle";
import parseModalData from "utils/parseModalData";

import _ from "lodash";
import contextMenu from "./contextMenu";
import useSimpleHttpFunctions from "hooks/useSimpleHttpFunctions";

const SharedModal = React.lazy(() => import("./modals/SharedModal"));
const SharedDeleteModal = React.lazy(() => import("./modals/SharedDeleteModal"));

const OrganizationStructure: FC = () => {
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);
    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.organizationStructure));
    }, []);

    const [treeData, setTreeData] = useState<Array<IExtendedOrgStructureTreeItem>>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const handleExpandKeys = useCallback((v: any) => {
        setExpandedKeys([...v]);
    }, []);

    const [companyId, setCompanyId] = useState<number | null>(null);

    const {
        getCompanyById,
        getDivisionById,
        getDivisionUnitById,
        initPositionOptions,
        positions,
        getTreeData,
        getCurrentUserData
    } = useSimpleHttpFunctions();

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        const currentUserData: ICurrentUserDtoViewModel = await getCurrentUserData();
        if (currentUserData) {
            const companyId = currentUserData.company.companyId;
            setCompanyId(companyId);
        }
    };

    useEffect(() => {
        if (companyId) {
            initTreeData();
        }
    }, [companyId]);

    const initTreeData = async (key?: string, updatedKey?: string) => {
        if (companyId) {
            const treeData = await getTreeData(companyId);
            const formattedTreeData = formatTreeData(treeData);
            console.log(formattedTreeData);
            if (!expandedKeys.includes(formattedTreeData[0].key)) {
                setExpandedKeys([formattedTreeData[0].key]);
            }
            if (key && !updatedKey) {
                setExpandedKeys((prev) => [...prev, key]);
            }
            if (
                key &&
                updatedKey &&
                expandedKeys.includes(key) &&
                !expandedKeys.includes(updatedKey)
            ) {
                setExpandedKeys((prev) => [..._.without(prev, key), updatedKey]);
            }
            setTreeData(formattedTreeData);
        }
    };

    type TSelectedTreeEntity = { treeItem: IOrgStructureTreeItem; layoutOption: TLayoutOptions };
    const [selectedTreeEntity, setSelectedTreeEntity] = useState<TSelectedTreeEntity>(
        {} as TSelectedTreeEntity
    );

    //for edition
    const [existingData, setExistingData] = useState<any>({});

    const getExistingCompanyData = async () => {
        const companyData = await getCompanyById(companyId!);
        setExistingData(companyData);
    };
    const getExistingDivisionData = async (id: number) => {
        const divisionData = await getDivisionById(id);
        setExistingData(divisionData);
    };
    const getExistingDivisionUnitData = async (id: number) => {
        const divisionUnitData = await getDivisionUnitById(id);
        setExistingData(divisionUnitData);
    };

    //delete modal
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const onSetDeleteModalIsVisible = useCallback((v: boolean) => setDeleteModalVisible(v), []);
    const onDeleteItem = useCallback(() => {
        const { id, nodeType } = selectedTreeEntity.treeItem || {};
        actionMethodResultSync(
            "DICTIONARY",
            `${nodeType === nodeTypeEnum.DIVISION ? "division" : "division-unit"}/${id}`,
            "delete",
            getRequestHeader(authContext.token)
        )
            .then(() => {
                message.success("Успешно удалено");
                initTreeData();
            })
            .catch(() => message.error("Ошибка"));
    }, [selectedTreeEntity, initTreeData]);

    //shared modal
    const [form] = Form.useForm();
    const [modalIsVisible, setModalIsVisible] = useState(false);
    const onSetModalIsVisible = useCallback((v: boolean) => setModalIsVisible(v), []);

    const modalTitle = getOrgStructureModalTitle(selectedTreeEntity.layoutOption);

    const handleMenuClick =
        (treeItem: IOrgStructureTreeItem, layoutOption: TLayoutOptions) => () => {
            setSelectedTreeEntity({
                treeItem,
                layoutOption
            });
            form.resetFields();

            if (deletingOptions.includes(layoutOption)) {
                onSetDeleteModalIsVisible(true);
            } else {
                onSetModalIsVisible(true);
            }
        };

    const handleEditClick = (treeItem: IOrgStructureTreeItem) => () => {
        const { nodeType, id } = treeItem || {};
        setSelectedTreeEntity({
            treeItem,
            layoutOption:
                nodeType === nodeTypeEnum.COMPANY
                    ? layoutOptions.EDIT_COMPANY
                    : nodeType === nodeTypeEnum.DIVISION
                    ? layoutOptions.EDIT_DIVISION
                    : layoutOptions.EDIT_DIVISION_UNIT
        });

        if (nodeType === nodeTypeEnum.COMPANY) {
            getExistingCompanyData().then(() => {
                onSetModalIsVisible(true);
            });
        }
        if (nodeType === nodeTypeEnum.DIVISION) {
            getExistingDivisionData(id).then(() => {
                onSetModalIsVisible(true);
            });
        }
        if (nodeType === nodeTypeEnum.DIVISION_UNIT) {
            getExistingDivisionUnitData(id).then(() => {
                onSetModalIsVisible(true);
            });
        }
    };

    const onFinishingModal = useCallback(
        async (data: any) => {
            const parsedData = parseModalData(
                data?.priority ? { ...data, priority: +data.priority } : data
            );
            const { layoutOption, treeItem } = selectedTreeEntity;
            const { nodeType, id, code } = treeItem || {};

            if (nodeType === nodeTypeEnum.COMPANY) {
                if (layoutOption === layoutOptions.ADD_DIVISION) {
                    actionMethodResultSync(
                        "DICTIONARY",
                        `division`,
                        "post",
                        getRequestHeader(authContext.token),
                        { companyId: companyId, ...parsedData }
                    )
                        .then(() => {
                            message.success("Успешно сохранено");
                            onSetModalIsVisible(false);
                            initTreeData();
                        })
                        .catch(() => message.error("Ошибка"));
                } else if (layoutOption === layoutOptions.EDIT_COMPANY) {
                    actionMethodResultSync(
                        "DICTIONARY",
                        `company`,
                        "put",
                        getRequestHeader(authContext.token),
                        _.merge(existingData, parsedData)
                    )
                        .then(() => {
                            message.success("Успешно сохранено");
                            onSetModalIsVisible(false);
                            initTreeData();
                        })
                        .catch(() => message.error("Ошибка"));
                }
            }

            if (nodeType === nodeTypeEnum.DIVISION) {
                if (layoutOption === layoutOptions.ADD_DIVISION_UNIT) {
                    if (parsedData.priority && parsedData.position) {
                        const companyData = await getCompanyById(companyId!);

                        actionMethodResultSync(
                            "DICTIONARY",
                            `division-unit`,
                            "post",
                            getRequestHeader(authContext.token),
                            {
                                company: companyData,
                                priority: parsedData.priority,
                                isCompanyHead: parsedData.isCompanyHead,
                                position: parsedData.position,
                                division: { divisionId: id }
                            }
                        )
                            .then(() => {
                                message.success("Успешно сохранено");
                                onSetModalIsVisible(false);
                                initTreeData(code);
                            })
                            .catch(() => message.error("Ошибка"));
                    } else {
                        actionMethodResultSync(
                            "DICTIONARY",
                            "position",
                            "post",
                            getRequestHeader(authContext.token),
                            parsedData
                        )
                            .then(() => {
                                message.success("Добавлена позиция");
                                initPositionOptions();
                            })
                            .catch(() => message.error("Ошибка"));
                    }
                }
                if (layoutOption === layoutOptions.ADD_DIVISION) {
                    actionMethodResultSync(
                        "DICTIONARY",
                        "division",
                        "post",
                        getRequestHeader(authContext.token),
                        { companyId: companyId, ...parsedData, parentId: id }
                    )
                        .then(() => {
                            message.success("Успешно сохранено");
                            onSetModalIsVisible(false);
                            initTreeData(code);
                        })
                        .catch(() => message.error("Ошибка"));
                }
                if (layoutOption === layoutOptions.EDIT_DIVISION) {
                    actionMethodResultSync(
                        "DICTIONARY",
                        `division`,
                        "put",
                        getRequestHeader(authContext.token),
                        _.merge(existingData, parsedData)
                    )
                        .then(() => {
                            message.success("Успешно сохранено");
                            onSetModalIsVisible(false);
                            initTreeData(code, parsedData.code);
                        })
                        .catch(() => message.error("Ошибка"));
                }
            }

            if (nodeType === nodeTypeEnum.DIVISION_UNIT) {
                if (layoutOption === layoutOptions.EDIT_DIVISION_UNIT) {
                    const reqData = {
                        ...existingData,
                        unitId: id,
                        priority: parsedData.priority,
                        position: parsedData.position,
                        isCompanyHead: parsedData.isCompanyHead
                    };
                    actionMethodResultSync(
                        "DICTIONARY",
                        `division-unit`,
                        "put",
                        getRequestHeader(authContext.token),
                        reqData
                    )
                        .then(() => {
                            message.success("Успешно сохранено");
                            onSetModalIsVisible(false);
                            initTreeData();
                        })
                        .catch(() => message.error("Ошибка"));
                }
            }
        },
        [selectedTreeEntity, existingData]
    );

    const getIcon = (treeItem: IOrgStructureTreeItem): JSX.Element => {
        const { nodeType, isCompanyHead } = treeItem;
        return (
            <>
                {nodeType === nodeTypeEnum.COMPANY ? (
                    <ClusterOutlined className={classes.typeIcon} />
                ) : nodeType === nodeTypeEnum.DIVISION ? (
                    <BranchesOutlined className={classes.typeIcon} />
                ) : isCompanyHead ? (
                    <CrownOutlined className={classes.typeIcon} />
                ) : (
                    <UserOutlined className={classes.typeIcon} />
                )}
                <div className={classes.iconWrapper}>
                    <EditOutlined
                        onClick={handleEditClick(treeItem)}
                        className={classes.editIcon}
                    />
                    <Dropdown overlay={contextMenu(treeItem, handleMenuClick)!}>
                        <Space>
                            <DragOutlined className={classes.dragIcon} />
                        </Space>
                    </Dropdown>
                </div>
            </>
        );
    };

    const formatTreeData = (treeData: Array<IOrgStructureTreeItem>) => {
        let newTreeData = [] as Array<IExtendedOrgStructureTreeItem>;
        treeData.forEach((treeItem) => {
            if (treeItem.children.length > 0) {
                newTreeData = [
                    ...newTreeData,
                    {
                        ...treeItem,
                        title: (
                            <span
                                style={{
                                    color:
                                        treeItem.nodeType === nodeTypeEnum.DIVISION_UNIT
                                            ? theme.color.mainText + ""
                                            : theme.color.regular + ""
                                }}
                            >
                                {treeItem.nameRu}
                            </span>
                        ),
                        key: treeItem.code,
                        children: formatTreeData(treeItem.children),
                        icon: getIcon(treeItem)
                    }
                ];
            } else {
                newTreeData = [
                    ...newTreeData,
                    {
                        ...treeItem,
                        title: (
                            <span
                                style={{
                                    color:
                                        treeItem.nodeType === nodeTypeEnum.DIVISION_UNIT
                                            ? theme.color.mainText + ""
                                            : theme.color.regular + ""
                                }}
                            >
                                {treeItem.nameRu}
                            </span>
                        ),
                        key: treeItem.code,
                        icon: getIcon(treeItem)
                    }
                ];
            }
        });
        return newTreeData;
    };

    return (
        <Row className={classes.container}>
            <Row className={classes.treeWrapper}>
                <Col span={24}>
                    <Tree
                        showLine={true}
                        expandedKeys={expandedKeys}
                        onExpand={handleExpandKeys}
                        showIcon
                        className={classes.tree}
                        // switcherIcon={<DownOutlined />}
                        treeData={treeData}
                    />
                </Col>
            </Row>
            <Suspense>
                <SharedDeleteModal
                    okText={"Удалить"}
                    title={modalTitle}
                    isVisible={deleteModalVisible}
                    setIsVisible={onSetDeleteModalIsVisible}
                    onDeleteItem={onDeleteItem}
                />
            </Suspense>
            <Suspense>
                <SharedModal
                    okText={"Сохранить"}
                    title={modalTitle}
                    setIsVisible={onSetModalIsVisible}
                    existingData={existingData}
                    onFinish={onFinishingModal}
                    selectedTreeEntity={selectedTreeEntity}
                    isVisible={modalIsVisible}
                    form={form}
                    positions={positions}
                />
            </Suspense>
        </Row>
    );
};
export default OrganizationStructure;
