import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { useDispatch } from "react-redux";
import { Row, Col, Select, Tree, Menu, Dropdown, Space, Form } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { AuthContext } from "context/AuthContextProvider";
import useCompaniesData from "hooks/useCompaniesData";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";
import {
    DownOutlined,
    DragOutlined,
    EditOutlined,
    ClusterOutlined,
    BranchesOutlined,
    UserOutlined
} from "@ant-design/icons";
import { nodeTypeEnum } from "data/enums";
import { IExtendedOrgStructureTreeItem, IOrgStructureTreeItem } from "interfaces";
import DivisionUnitDeleteModal from "./modals/divisionUnitDeleteModal";

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

    const { companies } = useCompaniesData();

    const handleSelectCompanyId = useCallback((value: string | number) => {
        setSelectedCompanyId(+value);
        sessionStorage.setItem("selectedCompanyId", value + "");
    }, []);

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
        ).then((data) => data);
    };

    const [editForm] = Form.useForm();

    const [selectedNodeType, setSelectedNodeType] = useState("");
    const [deletionDivisionUnitId, setDeletionDivisionUnitId] = useState(0);

    //division delete modal
    const [deleteDivisionUnitModalOpen, setDeleteDivisionUnitModalOpen] = useState(false);
    const onDeleteDivisionUnitModalOpen = useCallback(
        (v: boolean) => setDeleteDivisionUnitModalOpen(v),
        []
    );
    const onDeleteDivisionUnit = useCallback(() => {
        if (deletionDivisionUnitId) {
            actionMethodResultSync(
                "DICTIONARY",
                `division-unit/${deletionDivisionUnitId}`,
                "delete",
                getRequestHeader(authContext.token)
            );
            initTreeData();
        }
    }, [treeData, deletionDivisionUnitId, initTreeData]);

    const [editionModalOpen, setEditionModalOpen] = useState(false);

    const divisionUnitContextMenu = (id: number) => (
        <Menu
            items={[
                {
                    key: "1",
                    label: (
                        <span
                            onClick={() => {
                                setDeletionDivisionUnitId(id);
                                onDeleteDivisionUnitModalOpen(true);
                            }}
                        >
                            Удалить
                        </span>
                    )
                }
            ]}
        />
    );
    const divisionContextMenu = (
        <Menu
            items={[
                { key: "1", label: <span>Добавить подразделение</span> },
                { key: "2", label: <span>Добавить должность</span> }
            ]}
        />
    );
    const companyContextMenu = (
        <Menu items={[{ key: "1", label: <span>Добавить подразделение</span> }]} />
    );

    const getIcon = (treeItem: IOrgStructureTreeItem): JSX.Element => {
        const { nodeType, id } = treeItem || {};
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
                        onClick={() => {
                            setSelectedNodeType(nodeType);
                            setEditionModalOpen(true);
                        }}
                        className={classes.editIcon}
                    />
                    <Dropdown
                        overlay={
                            nodeType === nodeTypeEnum.COMPANY
                                ? companyContextMenu
                                : nodeType === nodeTypeEnum.DIVISION
                                ? divisionContextMenu
                                : divisionUnitContextMenu(id)
                        }
                    >
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

    console.log(treeData);

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
                title={"Вы действительно хотите удалить текущую должность?"}
                isVisible={deleteDivisionUnitModalOpen}
                setIsVisible={onDeleteDivisionUnitModalOpen}
                onDeleteDivisionUnit={onDeleteDivisionUnit}
            />
        </Row>
    );
};
export default OrganizationStructure;
