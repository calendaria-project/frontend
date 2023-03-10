import React, { FC, memo, useCallback } from "react";
import { Drawer, Row } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";
import SharedDrawerContent from "components/Shared/Users/userDrawer/SharedDrawerContent";

interface IExternalUserDrawer {
    open: boolean;
    setOpen: (val: boolean) => void;
    userData: IUsersWithPhotoInfoModel;
}

const userDrawer: FC<IExternalUserDrawer> = ({ open, setOpen, userData }) => {
    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    const onClose = useCallback(() => setOpen(false), []);

    return (
        <Drawer className={classes.drawer} width={"30vw"} onClose={onClose} open={open}>
            <Row className={classes.container}>
                <SharedDrawerContent userData={userData} />
            </Row>
        </Drawer>
    );
};
export default memo(userDrawer);
