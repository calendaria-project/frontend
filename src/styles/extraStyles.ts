import { createUseStyles } from "react-jss";

export default createUseStyles({
    "@global": {
        "span.ant-select-selection-item": {
            fontSize: "15px !important"
        },
        ".menuIconItem": {
            backgroundColor: "#0ea5e9",
            width: "4px",
            height: "4px",
            borderRadius: "4px",
            margin: "2px 5px"
        },
        ".menuIconWrap": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center"
        },
        ".editBtn": {
            marginRight: "10px"
        },
        "#usersTable": {
            ".tabulator": {
                ".tabulator-header": {
                    backgroundColor: "#fff !important"
                }
            },
            ".userGroupHeaderWrap": {
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "30px",
                color: "#000", //из темы?
                marginLeft: "20px"
            }
        }
    }
});
