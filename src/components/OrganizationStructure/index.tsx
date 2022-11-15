import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum, nodeTypeEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { Col, Dropdown, Form, Menu, message, Row, Select, Space, Tree } from "antd";
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
    DownOutlined,
    DragOutlined,
    EditOutlined,
    UserOutlined
} from "@ant-design/icons";
import { IExtendedOrgStructureTreeItem, IOrgStructureTreeItem } from "interfaces";
import DivisionUnitDeleteModal from "./modals/SharedDeleteModal";
import useOrgStructureHttpRequests from "./useOrgStructureHttpRequests";
import { deletingOptions, layoutOptions, TLayoutOptions } from "./contants";
import { SharedModal } from "./modals/SharedModal";
import getOrgStructureModalTitle from "utils/getOrgStructureModalTitle";
import parseModalData from "utils/parseModalData";

import _ from "lodash";

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
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
        Number(sessionStorage.getItem("selectedCompanyId")) || null
    );

    useEffect(() => {
        initTreeData();
    }, [selectedCompanyId]);

    const initTreeData = async () => {
        const treeData = await getTreeData();
        const formattedTreeData = formatTreeData(treeData);
        setTreeData(formattedTreeData);
    };

    const getTreeData = async () => {
        return actionMethodResultSync(
            "DICTIONARY",
            `division-unit/tree?companyId=${selectedCompanyId}`,
            "get",
            getRequestHeader(authContext.token)
        ).then((data) => {
            return data;
        });
    };

    const handleSelectCompanyId = useCallback((value: string | number) => {
        setSelectedCompanyId(+value);
        sessionStorage.setItem("selectedCompanyId", value + "");
    }, []);

    const { companies } = useCompaniesData();
    const { getCompanyById, getDivisionById, getDivisionUnitById, initPositionOptions, positions } =
        useOrgStructureHttpRequests();

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

    const modalTitle = useMemo(
        () =>
            getOrgStructureModalTitle(
                selectedTreeEntity.treeItem?.nodeType,
                selectedTreeEntity.layoutOption
            ),
        [selectedTreeEntity]
    );

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
            getExistingCompanyData();
        }
        if (nodeType === nodeTypeEnum.DIVISION) {
            getExistingDivisionData(id);
        }
        if (nodeType === nodeTypeEnum.DIVISION_UNIT) {
            getExistingDivisionUnitData(id);
        }

        onSetModalIsVisible(true);
    };

    const onFinishingModal = useCallback(
        async (data: any) => {
            const parsedData = parseModalData(data);
            const { layoutOption, treeItem } = selectedTreeEntity;
            const { nodeType, id } = treeItem || {};

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
                                initTreeData();
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
                            initTreeData();
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
                            initTreeData();
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

    const contextMenu = (treeItem: IOrgStructureTreeItem) => (
        <Menu
            items={
                treeItem.nodeType === nodeTypeEnum.COMPANY
                    ? [
                          {
                              key: "1",
                              label: (
                                  <span
                                      onClick={handleMenuClick(
                                          treeItem,
                                          layoutOptions.ADD_DIVISION
                                      )}
                                  >
                                      Добавить подразделение
                                  </span>
                              )
                          }
                      ]
                    : treeItem.nodeType === nodeTypeEnum.DIVISION
                    ? [
                          {
                              key: "1",
                              label: (
                                  <span
                                      onClick={handleMenuClick(
                                          treeItem,
                                          layoutOptions.ADD_DIVISION
                                      )}
                                  >
                                      Добавить подразделение
                                  </span>
                              )
                          },
                          {
                              key: "2",
                              label: (
                                  <span
                                      onClick={handleMenuClick(
                                          treeItem,
                                          layoutOptions.ADD_DIVISION_UNIT
                                      )}
                                  >
                                      Добавить должность
                                  </span>
                              )
                          },
                          {
                              key: "3",
                              label: (
                                  <span
                                      onClick={handleMenuClick(
                                          treeItem,
                                          layoutOptions.DELETE_DIVISION
                                      )}
                                  >
                                      Удалить
                                  </span>
                              )
                          }
                      ]
                    : [
                          {
                              key: "1",
                              label: (
                                  <span
                                      onClick={handleMenuClick(
                                          treeItem,
                                          layoutOptions.DELETE_DIVISION_UNIT
                                      )}
                                  >
                                      Удалить
                                  </span>
                              )
                          }
                      ]
            }
        />
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
                    <Dropdown overlay={contextMenu(treeItem)!}>
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
                        showIcon
                        className={classes.tree}
                        switcherIcon={<DownOutlined />}
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
