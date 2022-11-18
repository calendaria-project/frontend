import { IOrgStructureTreeItem } from "interfaces";
import { Menu } from "antd";
import { nodeTypeEnum } from "data/enums";
import { layoutOptions, TLayoutOptions } from "./contants";
import React from "react";

const contextMenu = (
    treeItem: IOrgStructureTreeItem,
    handleMenuClick: (treeItem: IOrgStructureTreeItem, layoutOption: TLayoutOptions) => () => void
) => (
    <Menu
        items={
            treeItem.nodeType === nodeTypeEnum.COMPANY
                ? [
                      {
                          key: "1",
                          label: (
                              <div onClick={handleMenuClick(treeItem, layoutOptions.ADD_DIVISION)}>
                                  Добавить подразделение
                              </div>
                          )
                      }
                  ]
                : treeItem.nodeType === nodeTypeEnum.DIVISION
                ? [
                      {
                          key: "1",
                          label: (
                              <div onClick={handleMenuClick(treeItem, layoutOptions.ADD_DIVISION)}>
                                  Добавить подразделение
                              </div>
                          )
                      },
                      {
                          key: "2",
                          label: (
                              <div
                                  onClick={handleMenuClick(
                                      treeItem,
                                      layoutOptions.ADD_DIVISION_UNIT
                                  )}
                              >
                                  Добавить должность
                              </div>
                          )
                      },
                      {
                          key: "3",
                          label: (
                              <div
                                  onClick={handleMenuClick(treeItem, layoutOptions.DELETE_DIVISION)}
                              >
                                  Удалить
                              </div>
                          )
                      }
                  ]
                : [
                      {
                          key: "1",
                          label: (
                              <div
                                  onClick={handleMenuClick(
                                      treeItem,
                                      layoutOptions.DELETE_DIVISION_UNIT
                                  )}
                              >
                                  Удалить
                              </div>
                          )
                      }
                  ]
        }
    />
);

export default contextMenu;
