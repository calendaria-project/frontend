import { Button as AntdButton } from "antd";
import { FC, ReactNode } from "react";
import cx from "classnames";

import { useTheme } from "react-jss";
import useStyles from "./styles";
import { ITheme } from "styles/theme/interface";

interface IButton {
    children: any;
    customType?: "regular" | "removing" | "primary";
    block?: boolean;
    danger?: boolean;
    disabled?: boolean;
    ghost?: boolean;
    href?: string;
    icon?: ReactNode;
    loading?: boolean;
    shape?: "default" | "circle" | "round";
    size?: "large" | "middle" | "small";
    target?: string;
    type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default";
    onClick?: () => void;
}

const Button: FC<IButton> = ({
    children,
    customType,
    block = false,
    danger = false,
    disabled = false,
    ghost = false,
    href,
    icon,
    loading = false,
    shape = "default",
    size = "middle",
    target,
    type = "default",
    onClick
}) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <AntdButton
            className={cx(classes.button, customType)}
            block={block}
            danger={danger}
            disabled={disabled}
            ghost={ghost}
            href={href}
            icon={icon}
            loading={loading}
            shape={shape}
            size={size}
            target={target}
            type={type}
            onClick={onClick}
        >
            {children}
        </AntdButton>
    );
};
export default Button;
