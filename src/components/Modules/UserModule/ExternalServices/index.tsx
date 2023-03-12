import { useDispatch } from "react-redux";
import { FC, useEffect } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";

const ExternalServices: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.external));
    }, []);

    return <>user external services</>;
};
export default ExternalServices;
