import { createUseStyles } from "react-jss";

export default createUseStyles({
    "@global": {
        // ".ant-col": {
        //     paddingLeft: "0 !important",
        //     paddingRight: "0 !important"
        // },
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
            maxWidth: "250px"
        },
        ".ant-table table": {
            borderTop: "1px solid #f0f0f0",
            borderRadius: "6px !important"
        },
        ".ant-table-content": {
            overflow: "auto"
        },
        ".ant-input, .ant-input-affix-wrapper, .ant-select-selector, .ant-picker, .ant-pagination-item, .ant-pagination-prev, .ant-pagination-next, .ant-card-bordered":
            {
                borderRadius: "6px !important",
                borderColor: "#C2C2C2 !important"
            },
        ".ant-table-container": {
            borderRadius: "6px !important"
        },
        ".ant-modal-title": {
            fontSize: "20px !important",
            fontWeight: "600 !important"
        },
        ".ant-table-thead > tr > th": {
            background: "#F4F6FB !important",
            fontSize: "20px !important"
        },
        ".ant-table-tbody > tr:last-child > td:first-child": {
            borderBottomLeftRadius: "6px !important"
        },
        ".ant-table-tbody > tr:last-child > td:last-child": {
            borderBottomRightRadius: "6px !important"
        },
        ".ant-table-thead > tr:first-child > th:first-child": {
            borderTopLeftRadius: "6px !important"
        },
        ".ant-table-thead > tr:first-child > th:last-child": {
            borderTopRightRadius: "6px !important"
        },
        ".ant-card-head": {
            height: "64px",
            borderTopLeftRadius: "6px !important",
            borderTopRightRadius: "6px !important"
        },
        ".ant-card-head-wrapper": {
            height: "100%"
        },
        ".ant-modal-header": {
            borderBottom: "none !important",
            textAlign: "center !important",
            padding: "30px 0px 10px 0px !important"
        },
        ".ant-modal-mask": {
            backgroundColor: "rgba(0, 0, 0, 0.20) !important"
        },
        ".ant-modal-header, .ant-modal-content": {
            borderRadius: "6px !important"
        },
        ".ant-modal-wrap": {
            backgroundColor: "rgba(0, 0, 0, 0.20) !important"
        },
        ".directoryModal": {
            "& .ant-form-item": {
                marginBottom: "14px !important"
            },
            "& .ant-form-item-label": {
                width: "100% !important",
                minWidth: "100% !important"
            },
            "& .ant-form-item-control": {
                width: "100% !important",
                minWidth: "100% !important"
            }
        }
    }
});
