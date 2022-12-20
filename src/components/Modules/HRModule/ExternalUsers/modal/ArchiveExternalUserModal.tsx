import { Modal } from "antd";

import React, { FC, memo, useCallback } from "react";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

interface IExternalUserArchiveModal {
    okText: string;
    title: string;
    isVisible: boolean;
    setIsVisible: (bool: boolean) => void;
    onArchiveItem: () => void;
}

const ExternalUserArchiveModal: FC<IExternalUserArchiveModal> = ({
    okText,
    title,
    isVisible,
    setIsVisible,
    onArchiveItem
}) => {
    const handleCancel = useCallback(() => {
        setIsVisible(false);
    }, []);

    const handleRemove = useCallback(() => {
        onArchiveItem();
        handleCancel();
    }, [onArchiveItem, handleCancel]);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <ModalBtns okText={okText} onCancel={handleCancel} onClick={handleRemove} />
        </Modal>
    );
};
export default memo(ExternalUserArchiveModal);
