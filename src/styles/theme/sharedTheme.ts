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
        lines: "#C2C2C2"
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
            secondary: "#F0F0F0"
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
    table: {
        header: {
            background: "#F2F2F2"
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
        margin: "12px"
    }
};
export default sharedTheme;
