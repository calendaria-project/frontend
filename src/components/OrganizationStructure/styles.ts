import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    container: {
        padding: (theme: ITheme) => theme.layout.padding,
        width: "100%"
    },
    select: {
        width: (theme: ITheme) => theme.select.width,
        "& .ant-select-selector": {
            borderColor: (theme: ITheme) => `${theme.color.lines} !important`
        }
    },
    selectionWrapper: {
        width: "100%"
    },
    treeWrapper: {
        width: "100%"
    },
    tree: {
        "& .ant-tree-treenode": {
            padding: "0 0 12px 0 !important"
        },
        "& .ant-tree-node-content-wrapper": {
            padding: "0 10px !important"
        },
        "& .ant-tree-list-holder-inner > div": {
            // width: "100%",
            // background: (theme: ITheme) => theme.background.primary,
            // border: (theme: ITheme) => `1px solid ${theme.color.lines}`,
            // borderRadius: (theme: ITheme) => theme.borderRadius,
            // padding: (theme: ITheme) => theme.layout.mediumPadding,
            // margin: (theme: ITheme) => theme.layout.smallMargin
        },
        "& .ant-tree-node-selected": {
            background: "none !important"
        }
    },
    iconWrapper: {
        position: "absolute",
        top: 0,
        right: "-52px"
    },
    dragIcon: {
        marginLeft: "8px",
        color: (theme: ITheme) => theme.image.color.regular
    },
    editIcon: {
        color: (theme: ITheme) => theme.image.color.regular
    },
    typeIcon: {
        color: (theme: ITheme) => theme.image.color.secondary
    }
});
