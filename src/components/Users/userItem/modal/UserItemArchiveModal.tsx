import { Col, Modal, Row } from "antd";

import Button from "ui/Button";

import React, { FC, memo, useCallback } from "react";

interface UserItemArchiveModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    handleDeleteUser: () => void;
}

const UserItemArchiveModal: FC<UserItemArchiveModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    handleDeleteUser
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleRemove = () => {
        handleDeleteUser();
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
export default memo(UserItemArchiveModal);
