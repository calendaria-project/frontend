import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import WithUsers from "components/Users/WithUsers";

const UserDrawer = React.lazy(() => import("./userDrawer"));

const Users: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.users));
    }, []);

    return (
        <WithUsers
            drawerChild={
                <UserDrawer
                    //initial empty values
                    open={false}
                    setOpen={() => {}}
                    userData={{} as IUsersWithPhotoInfoModel}
                />
            }
        />
    );
};
export default Users;
