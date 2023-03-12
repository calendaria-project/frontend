import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import WithUsers from "components/Shared/Users/WithUsers";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";

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
                    divisionsEquality={false}
                    open={false}
                    setOpen={() => {}}
                    userData={{} as IUsersWithPhotoInfoModel}
                />
            }
        />
    );
};
export default Users;
