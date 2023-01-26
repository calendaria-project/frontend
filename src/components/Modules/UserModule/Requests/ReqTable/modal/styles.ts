import { createUseStyles } from "react-jss";

export default createUseStyles({
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    checkbox: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    btnContainer: {
        width: "100%",
        margin: "10px 0"
    },
    fullWidth: {
        width: "100%"
    }
});
