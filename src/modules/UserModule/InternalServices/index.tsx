import { useDispatch } from "react-redux";
import { FC, useEffect } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";

const InternalServices: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.internal));
    }, []);

    return <>user internal services</>;
};
export default InternalServices;
