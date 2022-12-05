import { Modal } from "antd";

import React, { FC, memo, useCallback } from "react";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

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
            <ModalBtns okText={okText} onClick={handleRemove} />
        </Modal>
    );
};
export default memo(UserItemArchiveModal);
