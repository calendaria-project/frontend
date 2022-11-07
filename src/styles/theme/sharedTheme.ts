import { ITheme } from "./interface";

const sharedTheme: ITheme = {
    color: {
        primary: "#FFFFFF",
        secondary: "#2C2C2C",
        boldText: "#000000",
        mainText: "#333333",
        extraText: "#828282",
        regular: "#016FC0",
        removing: "#EB5757",
        successful: "#27AE60",
        arrow: "#000000",
        lines: "#C2C2C2",
        disabled: "rgba(0, 0, 0, 0.25)"
    },
    background: {
        primary: "#FFFFFF",
        secondary: "#2C2C2C",
        regular: "#016FC0"
    },
    border: "1px solid",
    borderRadius: "6px",
    fontWeight: {
        btn: 400,
        primary: 500,
        bold: 600
    },
    selection: {
        background: {
            primary: "#2C2C2C",
            secondary: "#F0F0F0",
            transparency: "#F0F0F0"
        }
    },
    image: {
        fontSize: "20px",
        color: {
            primary: "#FFFFFF",
            secondary: "#2C2C2C",
            regular: "#016FC0",
            transparency: "#C2C2C2"
        }
    },
    button: {
        height: "34px",
        colors: {
            primary: "#FFFFFF",
            secondary: "#2C2C2C",
            regular: "#016FC0"
        },
        border: {
            primary: "#2C2C2C",
            secondary: "#C2C2C2"
        },
        background: {
            primary: "#FFFFFF",
            secondary: "#2C2C2C"
        }
    },
    select: {
        width: "200px"
    },
    input: {
        width: "300px"
    },
    table: {
        header: {
            background: "#F2F2F2",
            slight: "#F4F6FB",
            secondary: "#C2C2C2"
        },
        background: "#E0E0E0",
        color: "#333333",
        selection: "#F0F0F0"
    },
    notifications: {
        color: "#000000"
    },
    layout: {
        header: {
            height: "64px"
        },
        padding: "20px",
        margin: "14px",
        smallMargin: "4px",
        mediumPadding: "8px",
        smallPadding: "4px"
    }
};
export default sharedTheme;
