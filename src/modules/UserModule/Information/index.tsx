import { useDispatch } from "react-redux";
import { FC, useEffect } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";

const Information: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.information));
    }, []);

    return <>user information</>;
};
export default Information;
