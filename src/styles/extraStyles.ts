import { createUseStyles } from "react-jss";

export default createUseStyles({
    "@global": {
        ".ant-col": {
            paddingLeft: "0 !important",
            paddingRight: "0 !important"
        },
        ".ant-row": {
            marginLeft: "0 !important",
            marginRight: "0 !important"
        },
        "span.ant-select-selection-item": {
            fontSize: "15px !important"
        },
        "th.ant-table-cell": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px"
        },
        ".ant-input, .ant-select-selector, .ant-picker, .ant-pagination-item, .ant-pagination-prev .ant-pagination-next":
            {
                borderRadius: "6px !important",
                borderColor: "#C2C2C2 !important"
            },
        ".ant-modal-title": {
            fontSize: "20px !important",
            fontWeight: "600 !important"
        }
    }
});
