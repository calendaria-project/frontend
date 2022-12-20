import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    wrapper: {
        padding: (theme: ITheme) => theme.layout.padding
    },
    selectionRow: {
        width: "100%"
    },
    select: {
        width: (theme: ITheme) => theme.input.width,
        "& .ant-select-selector": {
            borderColor: (theme: ITheme) => `${theme.color.lines} !important`
        }
    },
    datePicker: {
        width: (theme: ITheme) => theme.select.width,
        marginLeft: (theme: ITheme) => theme.layout.margin
    },
    input: {
        width: (theme: ITheme) => theme.input.width,
        borderRadius: (theme: ITheme) => theme.borderRadius,
        borderColor: (theme: ITheme) => theme.color.lines,
        marginRight: (theme: ITheme) => theme.layout.margin
    },
    suffix: {
        color: (theme: ITheme) => theme.color.lines
    },
    fullNameWrap: {
        display: "flex",
        alignItems: "center",
        rowGap: "6px",
        flexDirection: "row"
    },
    fullNameText: {
        marginLeft: (theme: ITheme) => theme.layout.margin,
        color: (theme: ITheme) => theme.color.mainText,
        overflow: "hidden !important",
        textOverflow: "ellipsis !important"
    },
    usersByStaffingPhoto: {
        borderRadius: "50%"
    },
    usersByStaffingTableWrap: {
        marginTop: (theme: ITheme) => theme.layout.margin,
        width: "100%"
    }
});
