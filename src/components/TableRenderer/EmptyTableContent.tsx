import { memo } from "react";
import { Row } from "antd";

import emptyImg from "assets/icons/emptyImg.png";
import useStyles from "./styles";

const EmptyTableContent = () => {
    const classes = useStyles();

    return (
        <Row className={classes.container}>
            <img src={emptyImg} alt={"empty img"} />
        </Row>
    );
};
export default memo(EmptyTableContent);
