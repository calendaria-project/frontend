import { Button as AntdButton } from "antd";
import { FC, ReactNode } from "react";
import cx from "classnames";
import { CSSProperties } from "react";

import { useTheme } from "react-jss";
import useStyles from "./styles";
import { ITheme } from "styles/theme/interface";
import * as React from "react";

interface IButton {
    children?: any;
    className?: string;
    customType?:
        | "regular"
        | "removing"
        | "primary"
        | "cancel"
        | "removingGrounded"
        | "addingGrounded";
    block?: boolean;
    danger?: boolean;
    disabled?: boolean;
    ghost?: boolean;
    href?: string;
    htmlType?: "button" | "reset" | "submit";
    icon?: ReactNode;
    loading?: boolean;
    shape?: "default" | "circle" | "round";
    size?: "large" | "middle" | "small";
    target?: string;
    type?: "primary" | "ghost" | "dashed" | "link" | "text" | "default";
    onClick?: React.MouseEventHandler<HTMLElement>;
    style?: CSSProperties;
}

const Button: FC<IButton> = ({
    children,
    className,
    customType,
    block = false,
    danger = false,
    disabled = false,
    ghost = false,
    href,
    htmlType = "button",
    icon,
    loading = false,
    shape = "default",
    size = "middle",
    target,
    type = "default",
    onClick,
    style
}) => {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles({ theme, disabled, size });

    return (
        <AntdButton
            className={cx(classes.button, customType, className)}
            block={block}
            danger={danger}
            disabled={disabled}
            ghost={ghost}
            href={href}
            htmlType={htmlType}
            icon={icon}
            loading={loading}
            shape={shape}
            size={size}
            target={target}
            type={type}
            onClick={onClick}
            style={style}
        >
            {children ? children : null}
        </AntdButton>
    );
};
export default Button;
