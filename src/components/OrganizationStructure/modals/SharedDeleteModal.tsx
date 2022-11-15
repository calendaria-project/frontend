import { Col, Modal, Row } from "antd";

import Button from "ui/Button";

import React, { FC, memo, useCallback } from "react";

interface IDivisionUnitDeleteModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onDeleteItem: () => void;
}

const SharedDeleteModal: FC<IDivisionUnitDeleteModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onDeleteItem
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleRemove = () => {
        onDeleteItem();
        handleCancel();
    };

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Row align={"middle"} justify={"center"} gutter={[16, 16]}>
                <Col>
                    <Button customType={"removing"} onClick={handleRemove}>
                        {okText}
                    </Button>
                </Col>
                <Col>
                    <Button className="cancel-btn" onClick={handleCancel}>
                        Отмена
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};
export default memo(SharedDeleteModal);
