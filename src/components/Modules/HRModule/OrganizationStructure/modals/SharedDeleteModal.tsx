import { Modal } from "antd";

import React, { FC, memo, useCallback } from "react";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

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

    const handleRemove = useCallback(() => {
        onDeleteItem();
        handleCancel();
    }, [handleCancel, onDeleteItem]);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <ModalBtns okText={okText} onClick={handleRemove} onCancel={handleCancel} />
        </Modal>
    );
};
export default memo(SharedDeleteModal);
