import { useDispatch } from "react-redux";
import { FC, useEffect } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";

const Audit: FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.auditMenu));
    }, []);

    return <>admin audit menu</>;
};
export default Audit;
