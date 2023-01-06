import { Modal } from "antd";

import React, { FC, memo, useCallback } from "react";
import ModalBtns from "../modalBtns";

interface ISimpleConfirmationModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    confirmAction: () => void;
}

const SimpleConfirmationModal: FC<ISimpleConfirmationModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    confirmAction
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleRemove = useCallback(() => {
        confirmAction();
        handleCancel();
    }, [confirmAction, handleCancel]);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <ModalBtns okText={okText} onCancel={handleCancel} onClick={handleRemove} />
        </Modal>
    );
};

export default memo(SimpleConfirmationModal);
