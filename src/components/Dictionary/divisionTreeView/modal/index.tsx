import { Modal, Form, Input, Row, Col } from "antd";
import { IDivisionCreateViewModel, IDivisionViewModel } from "interfaces";
import { FormInstance } from "antd/es/form/Form";
import { validateMessages } from "data/validateMessages";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import React from "react";
import ModalBtns from "components/Shared/modalRenderer/modalBtns";

export interface IDivisionDirectoryModal {
    okText: string;
    title: string;
    setIsVisible: (val: boolean) => void;
    onFinish: (values: IDivisionCreateViewModel | IDivisionViewModel) => void;
    isVisible: boolean;
    form: FormInstance<IDivisionCreateViewModel | IDivisionViewModel>;
}

export const DivisionDirectoryModal = ({
    title,
    okText,
    onFinish,
    isVisible,
    setIsVisible,
    form
}: IDivisionDirectoryModal) => {
    const handleCancel = () => {
        setIsVisible(false);
    };

    const theme = useTheme<ITheme>();
    const classes = useStyles(theme);

    return (
        <Modal title={title} open={isVisible} footer={null} onCancel={handleCancel}>
            <Form<IDivisionCreateViewModel>
                form={form}
                name="basic"
                validateMessages={validateMessages}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                className="directoryModal"
            >
                <Row gutter={16}>
                    <Form.Item hidden name="companyId" />
                    <Form.Item hidden name="parentId" />
                    <Form.Item hidden name="divisionId" />
                    <Form.Item hidden name="createdAt" />

                    <Col span={12}>
                        <Form.Item
                            className={classes.leftFormItem}
                            name="code"
                            label="Код"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.rightFormItem}
                            name="nameKz"
                            label="На Казахском"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className={classes.leftFormItem}
                            name="nameRu"
                            label="На русском"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            className={classes.rightFormItem}
                            name="nameEn"
                            label="На английском"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <ModalBtns okText={okText} onClick={handleCancel} />
            </Form>
        </Modal>
    );
};
