import { useDispatch } from "react-redux";
import React, { FC, useEffect } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";

const MainMenu: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.mainMenu));
    }, []);

    return <>admin main menu</>;
};
export default MainMenu;
