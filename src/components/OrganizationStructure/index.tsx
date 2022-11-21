import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum, nodeTypeEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { Col, Dropdown, Form, message, Row, Select, Space, Tree } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { AuthContext } from "context/AuthContextProvider";
import useCompaniesData from "hooks/useCompaniesData";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import {
    BranchesOutlined,
    ClusterOutlined,
    // DownOutlined,
    DragOutlined,
    EditOutlined,
    UserOutlined
} from "@ant-design/icons";
import { IExtendedOrgStructureTreeItem, IOrgStructureTreeItem } from "interfaces";
import DivisionUnitDeleteModal from "./modals/SharedDeleteModal";
import useOrgStructureHttpRequests from "./hooks/useOrgStructureHttpRequests";
import { deletingOptions, layoutOptions, TLayoutOptions } from "./contants";
import SharedModal from "./modals/SharedModal";
import getOrgStructureModalTitle from "utils/getOrgStructureModalTitle";
import parseModalData from "utils/parseModalData";

import _ from "lodash";
import contextMenu from "./contextMenu";

const { Option } = Select;

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

    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
        Number(sessionStorage.getItem("selectedCompanyId")) || null
    );

    const {
        getCompanyById,
        getDivisionById,
        getDivisionUnitById,
        initPositionOptions,
        positions,
        getTreeData
    } = useOrgStructureHttpRequests();

    useEffect(() => {
        if (selectedCompanyId) {
            initTreeData();
        }
    }, [selectedCompanyId]);

    const initTreeData = async (key?: string, updatedKey?: string) => {
        if (selectedCompanyId) {
            const treeData = await getTreeData(selectedCompanyId);
            const formattedTreeData = formatTreeData(treeData);
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

    const { companies } = useCompaniesData();
    const handleSelectCompanyId = useCallback((value: string | number) => {
        setSelectedCompanyId(+value);
        sessionStorage.setItem("selectedCompanyId", value + "");
    }, []);

    type TSelectedTreeEntity = { treeItem: IOrgStructureTreeItem; layoutOption: TLayoutOptions };
    const [selectedTreeEntity, setSelectedTreeEntity] = useState<TSelectedTreeEntity>(
        {} as TSelectedTreeEntity
    );

    //for edition
    const [existingData, setExistingData] = useState<any>({});

    const getExistingCompanyData = async () => {
        const companyData = await getCompanyById(selectedCompanyId as number);
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
                        { companyId: selectedCompanyId, ...parsedData }
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
                        const companyData = await getCompanyById(selectedCompanyId as number);

                        actionMethodResultSync(
                            "DICTIONARY",
                            `division-unit`,
                            "post",
                            getRequestHeader(authContext.token),
                            {
                                company: companyData,
                                priority: parsedData.priority,
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
                        { companyId: selectedCompanyId, ...parsedData, parentId: id }
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
                        position: parsedData.position
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
        const { nodeType } = treeItem;
        return (
            <>
                {nodeType === nodeTypeEnum.COMPANY ? (
                    <ClusterOutlined className={classes.typeIcon} />
                ) : nodeType === nodeTypeEnum.DIVISION ? (
                    <BranchesOutlined className={classes.typeIcon} />
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
                        title: treeItem.nameRu,
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
                        title: treeItem.nameRu,
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
            <Row className={classes.selectionWrapper}>
                <Col span={24}>
                    <Select
                        placeholder="Выберите компанию"
                        className={classes.select}
                        value={selectedCompanyId || null}
                        onChange={handleSelectCompanyId}
                    >
                        {companies.map((el, i) => (
                            <Option key={i} value={el.companyId}>
                                {el.nameRu}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
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
            <DivisionUnitDeleteModal
                okText={"Удалить"}
                title={modalTitle}
                isVisible={deleteModalVisible}
                setIsVisible={onSetDeleteModalIsVisible}
                onDeleteItem={onDeleteItem}
            />
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
        </Row>
    );
};
export default OrganizationStructure;
