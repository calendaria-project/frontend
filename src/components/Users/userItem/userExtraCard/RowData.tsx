import React, { FC, memo, useState, useEffect } from "react";
import { Row, Col, Divider } from "antd";
import { TInputData, Types } from "./constants";

import "./styles.scss";
import { isObjectNotEmpty } from "utils/isObjectNotEmpty";
import { useTypedSelector } from "hooks/useTypedSelector";
import { getCurrentUserDataItemInfo } from "store/reducers/userReducer";

interface IRowData {
    dataItem: TInputData;
    usersId: string;
}

const RowData: FC<IRowData> = ({ dataItem, usersId }) => {
    const [displayedData, setDisplayedData] = useState<string>("");
    const currentUserDataItemInfo = useTypedSelector((state) =>
        getCurrentUserDataItemInfo(state.user)
    );
    const userMenuDataExists: boolean = isObjectNotEmpty(currentUserDataItemInfo);

    useEffect(() => {
        if (dataItem.type === Types.SELECT) {
            setDisplayedData(
                currentUserDataItemInfo?.[dataItem.propertyName]?.nameRu ??
                    currentUserDataItemInfo?.[0]?.[dataItem.propertyName]?.nameRu
            );
        } else {
            setDisplayedData(
                currentUserDataItemInfo?.[dataItem.propertyName] ??
                    currentUserDataItemInfo?.[0]?.[dataItem.propertyName]
            );
        }
    }, [currentUserDataItemInfo, dataItem, usersId]);

    return (
        <Row className="row-wrapper">
            <Col>{dataItem.placeholder}</Col>
            <Col className="col-end-wrapper">{userMenuDataExists ? displayedData : ""}</Col>
            <Divider className={"userItem__extraCard-divider"} />
        </Row>
    );
};
export default memo(RowData);
