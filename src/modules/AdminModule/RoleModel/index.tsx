import { useDispatch } from "react-redux";
import React, { FC, useEffect, useState, Suspense, useCallback } from "react";
import { SetCurrentOpenedMenu } from "store/actions";
import { mainMenuEnum } from "data/enums";
import { Row, Col, Select, Input, Form } from "antd";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import Button from "ui/Button";

const { Option } = Select;
const AddModal = React.lazy(() => import("./modal"));

const RoleModel: FC = () => {
    const dispatch = useDispatch();

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [form] = Form.useForm();

    const [addModalVisible, setAddModalVisible] = useState(false);

    useEffect(() => {
        dispatch(SetCurrentOpenedMenu(mainMenuEnum.roleModel));
    }, []);

    const handleOpenAddModal = useCallback(() => setAddModalVisible(true), []);

    return (
        <Row className={classes.container}>
            <Row justify={"space-between"} align={"middle"} className={classes.selectionRow}>
                <Col>
                    <Select className={classes.select} defaultValue="activeRoles">
                        <Option value="activeRoles">Действующие роли</Option>
                        <Option value="inactiveRoles">Недействующие роли</Option>
                    </Select>
                </Col>
                <Col>
                    <Input
                        className={classes.input}
                        placeholder="Поиск"
                        // onChange={handleFiltrationChange}
                        suffix={<SearchOutlined className={classes.suffix} />}
                    />
                    <Button
                        icon={<PlusOutlined />}
                        onClick={handleOpenAddModal}
                        customType={"regular"}
                    >
                        Добавить роль
                    </Button>
                </Col>
            </Row>
            <Suspense>
                <AddModal
                    okText={"Добавить"}
                    title={"Добавить роль"}
                    isVisible={addModalVisible}
                    setIsVisible={setAddModalVisible}
                    form={form}
                    onFinish={() => {}}
                />
            </Suspense>
        </Row>
    );
};
export default RoleModel;
