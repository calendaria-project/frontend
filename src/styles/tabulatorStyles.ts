import { createUseStyles } from "react-jss";

const grey200 = "#e4e7ec";

export default createUseStyles({
    "@global": {
        ".tabulator": {
            backgroundColor: "transparent !important",
            border: "none !important",
            margin: "0 !important"
        },
        ".tabulator-selected": {
            width: "100% !important",
            display: "none !important"
        },
        ".tabulator-col-title": {
            fontSize: "20px !important", //брать из темы
            "&-holder": {
                // margin-top: -5px !important;
                // margin-bottom: 4px !important;
                width: "200px !important",
                overflow: "hidden !important",
                textOverflow: "ellipsis !important",
                fontSize: "20px !important", //брать из темы
                fontWeight: "400 !important",
                color: "black !important" //брать из темы?
            }
        },
        ".tabulator .tabulator-header, .tabulator .tabulator-header .tabulator-col": {
            // height: 68px !important,
            background: "#E0E0E0 !important",
            minHeight: "50px !important",
            border: "none !important"
        },
        ".tabulator .tabulator-header .tabulator-col:last-child > div": {
            paddingRight: "0 !important"
        },
        ".tabulator-header": {
            marginLeft: "0px !important",
            "&-filter": {
                marginTop: "5px !important",
                margin: 0,
                padding: 0,
                "& input": {
                    height: "24px !important",
                    paddingLeft: "12px !important",
                    border: "none !important",
                    backgroundColor: "transparent !important",
                    "&:focus-visible": {
                        outline: "none !important"
                    }
                }
            }
        },
        ".tabulator-tableHolder": {
            border: `1px solid ${grey200} !important`, //брать из темы
            ".tabulator-table": {
                width: "100% !important"
            }
        },
        ".tabulator .tabulator-tableHolder .tabulator-placeholder span": {
            fontSize: "17px !important",
            color: "#333 !important" //из темы?
        },
        ".tabulator-row": {
            width: "100% !important",
            minHeight: "70px !important",
            height: "70px !important",
            display: "flex !important",
            alignItems: "center !important",
            userSelect: "none",
            "-moz-user-select": "none",
            "-webkit-user-select": "none",
            maxHeight: "100px !important",
            border: "none !important",
            /* border-bottom: 2px solid #fff !important; */
            color: "#000 !important", //брать из темы
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#f0f9fc !important" //из темы
            },
            "& .tabulator-selected": {
                backgroundColor: "#e0e0e0 !important"
                /* color: rgb(255, 0, 0) !important; */
                /* cursor: not-allowed; */
            },
            "& .tabulator-row-resize-handle": {
                height: "0 !important",
                display: "none !important",
                "& .prev": {
                    height: "0 !important",
                    display: "none !important"
                }
            }
        },
        '.tabulator-row .tabulator-cell[tabulator-field="id"]': {
            overflow: "visible !important"
        },
        ".tabulator-row.tabulator-selectable.tabulator-row-even:hover": {
            background: "#fafafa !important" //из темы?
        },
        ".tabulator-row.tabulator-selectable.tabulator-row-odd:hover": {
            background: "#fafafa !important"
        },
        ".tabulator-cell": {
            fontFamily: "Inter, sans-serif",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            letterSpacing: "0.01em",
            color: "#333333" //из темы?
        },
        ".tabulator-footer": {
            backgroundColor: "transparent !important",
            border: `1px solid ${grey200} !important`, //из темы
            borderRadius: "0 0 5px 5px !important"
        },
        ".tabulator-paginator label": {
            color: "#fff", //из темы?
            fontSize: "16px",
            paddingRight: "5px"
        },
        ".tabulator-paginator select, .tabulator-paginator button": {
            height: "30px !important",
            backgroundColor: "#bdcbdb !important", //из темы?
            /* box-shadow: 1px 2px 5px rgba(255, 255, 255, 0.25) !important; */
            color: "#fff !important", //из темы?
            opacity: "1 !important",
            cursor: "pointer"
        },
        ".tabulator-paginator button": {
            width: "35px !important"
        },
        ".tabulator-page.active": {
            backgroundColor: "#0669d3 !important", //из темы?
            border: "1.5px solid #0669d3 !important" //из темы?
        },
        '.tabulator .tabulator-header .tabulator-col.tabulator-sortable[aria-sort="none"] .tabulator-col-content .tabulator-col-sorter':
            {
                width: "20px",
                height: "20px",
                // background-color: #0669d3 !important;
                ".tabulator-arrow": {
                    // width: 20px;
                    // height: 20px;
                    // color: #0ea5e9 !important;
                    // background: url('../images/header/monitor.svg') no-repeat;
                    // background-size: cover;
                    // background-position: center center;
                    // display: none !important;
                    left: "2px !important"
                }
            },
        ".tabulator-dropdown": {
            position: "relative",
            display: "inline-block",
            padding: "5px",
            "&-item": {
                fontFamily: "Inter, sans-serif",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "13px",
                lineHeight: "150%",
                color: "#1f2937", //из темы?
                padding: "15px 20px",
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.179)" //из темы?
                }
            },
            "&-content": {
                display: "none",
                position: "absolute",
                right: "20px",
                top: 0,
                backgroundColor: "#ffffff",
                boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.06)",
                borderRadius: "8px",
                padding: "5px 0",
                zIndex: 9999,
                minWidth: "200px"
            },
            "&:hover .tabulator-dropdown-content": {
                display: "block"
            }
        }
        // .tabulator-row.tabulator-moving {
        //     // width: 100% !important;
        //     display: none !important;
        // }
    }
});
