import React, { FC, memo, useContext } from "react";
import { Row, Col, Divider } from "antd";
import { TInputData, Types } from "./constants";
import { AuthContext } from "context/AuthContextProvider";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { getRequestHeader } from "functions/common";

import "./styles.scss";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo } from "store/reducers/userReducer";

interface IRowData {
    dataItem: TInputData;
}

const RowData: FC<IRowData> = ({ dataItem }) => {
    const authContext = useContext(AuthContext);

    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );
    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);

    const getDisplayedData = () => {
        if (dataItem.type === Types.SELECT) {
            const id = currentUserDataItemInfo?.[dataItem.propertyName]?.id;
            if (id) {
                const url = `simple/${dataItem.dictionaryCode}/item/${id}`;
                actionMethodResultSync(
                    "DICTIONARY",
                    url,
                    "get",
                    getRequestHeader(authContext.token)
                ).then((data) => data?.nameRu);
            }
        } else {
            return currentUserDataItemInfo?.[dataItem.propertyName];
        }
    };

    return (
        <Row className="row-wrapper">
            <Col>{dataItem.placeholder}</Col>
            <Col className="col-end-wrapper">{userMenuDataExists ? getDisplayedData() : ""}</Col>
            <Divider className={"userItem__extraCard-divider"} />
        </Row>
    );
};
export default memo(RowData);
