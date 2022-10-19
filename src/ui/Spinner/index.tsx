import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { FC } from "react";

type TProps = {
    Icon?: React.FC<any>;
    size?: number;
    spin?: boolean;
};

const Spinner: FC<TProps> = ({ Icon, size = 40, spin = true }) => {
    const antIcon = Icon ? (
        <Icon style={{ fontSize: size }} spin={spin} />
    ) : (
        <LoadingOutlined style={{ fontSize: size }} spin={spin} />
    );

    return <Spin indicator={antIcon} />;
};
export default Spinner;
