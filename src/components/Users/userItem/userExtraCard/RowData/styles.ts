import { createUseStyles } from "react-jss";

export default createUseStyles({
    rowWrapper: {
        width: "100%",
        rowGap: "6px"
    },
    endedColWrapper: {
        display: "flex",
        flex: "1 1 auto",
        justifyContent: "end"
    },
    icon: {
        position: "absolute",
        right: "6px",
        top: "4px"
    }
});
