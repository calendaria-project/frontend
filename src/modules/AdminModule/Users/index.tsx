import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import WithUsers from "components/Users/WithUsers";
import { IUsersWithPhotoInfoModel } from "interfaces/extended";
import UserDrawer from "./userDrawer";

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
                    // isCurrentUserCreatorFlag={false}
                    // currentUserId={""}
                    open={false}
                    setOpen={() => {}}
                    userData={{} as IUsersWithPhotoInfoModel}
                />
            }
        />
    );
};

export default Users;
