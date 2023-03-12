import React from "react";
import useStyles from "./styles";
import { ITheme } from "styles/theme/interface";
import cx from "classnames";
import { useTheme } from "react-jss";

type TProps = {
    children: React.ReactNode | any;
    size: "h1" | "h2" | "h3" | "h4" | "h5" | string;
    className?: any;
    style?: any;
    prefix?: string;
};

function Header({ children, size = "h1", prefix, ...props }: TProps) {
    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    return (
        <div className={classes.heading}>
            <div className={cx(classes.heading, size)} {...props}>
                <span className={cx(classes.heading, prefix)}>{`${
                    prefix ? `${prefix} ` : ""
                }`}</span>
                {children}
            </div>
        </div>
    );
}

export default Header;
