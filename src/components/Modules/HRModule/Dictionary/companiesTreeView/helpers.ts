import { DataNodeItem } from "./index";
import { ICompanyTreeNodeModel } from "interfaces";

export const updateTreeChildrenData = (
    list: DataNodeItem[],
    id: number,
    children: DataNodeItem[]
): DataNodeItem[] =>
    list.map((node) => {
        let data = JSON.parse(JSON.stringify(children));
        if (node.id === id) {
            return {
                ...node,
                children: data
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeChildrenData(
                    JSON.parse(JSON.stringify(node.children)),
                    id,
                    JSON.parse(JSON.stringify(data))
                )
            };
        }
        return node;
    });

export const saveNode = (list: DataNodeItem[], data: DataNodeItem): DataNodeItem[] =>
    list.map((node) => {
        if (node.id === data.id) {
            return {
                ...data,
                children: node.children
            };
        }
        if (node.children) {
            return {
                ...node,
                children: saveNode(node.children, data)
            };
        }
        return node;
    });

export const addNode = (list: DataNodeItem[], id: number, data: DataNodeItem): DataNodeItem[] =>
    list.map((node) => {
        if (node.id === id) {
            return {
                ...node,
                children: [...node.children, data]
            };
        }
        if (node.children) {
            return {
                ...node,
                children: addNode(node.children, id, data)
            };
        }
        return node;
    });

export const getCompanyTreeItem = (data: ICompanyTreeNodeModel): DataNodeItem => {
    const id = data.id ? data.id : data.companyId;
    return {
        ...data,
        title: data.nameRu,
        id: id,
        key: id
    } as DataNodeItem;
};

export const modifyCompanyDataToTreeData = (data: ICompanyTreeNodeModel[]): DataNodeItem[] =>
    data.map((el) => getCompanyTreeItem(el));
