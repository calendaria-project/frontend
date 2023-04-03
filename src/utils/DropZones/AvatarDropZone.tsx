import React, { FC, memo, useEffect } from "react";
import { Button, Space, Typography, FormInstance } from "antd";
import Dropzone from "react-dropzone";
import { getBase64 } from "components/Modules/HRModule/Users/userDrawer/utils/getBase64";
import { actionMethodResultSync } from "http/actionMethodResult";
import { postFormDataHeader } from "http/common";
import { useContext, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { AuthContext } from "context/AuthContextProvider";
import { acceptedFiles } from "./acceptedFiles";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import useStyles from "./styles";
import cx from "classnames";

const { Title } = Typography;

const AvatarDropZone: FC<{
    form: FormInstance;
    userPhoto?: string | null;
    withSpace?: boolean;
}> = ({ form, userPhoto, withSpace = true }) => {
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    //
    // console.log(userPhoto, avatarUrl);

    useEffect(() => {
        setAvatarUrl(userPhoto ? userPhoto : null);
    }, [userPhoto]);

    const uploadButton = (
        <div className={classes.avatarWrap}>
            {loading ? <LoadingOutlined /> : <PlusOutlined className={classes.plusIcon} />}
        </div>
    );

    const uploadAvatarFile = (acceptedFiles: File[]) => {
        const fData = new FormData();
        fData.append("file", acceptedFiles[0]);
        setLoading(true);
        getBase64(acceptedFiles[0], (url) => {
            setLoading(false);
            setAvatarUrl(url);
        });
        actionMethodResultSync(
            "FILE",
            "file/upload",
            "post",
            postFormDataHeader(authContext.token),
            fData
        ).then((res) => {
            form.setFieldValue("profilePhotoId", res.id);
            getBase64(acceptedFiles[0], (url) => {
                setLoading(false);
                setAvatarUrl(url);
            });
        });
    };

    const deleteAvatar = (e: React.MouseEvent<HTMLElement>) => {
        if (!withSpace) {
            e.stopPropagation();
        }
        setAvatarUrl(null);
        form.setFieldValue("profilePhotoId", null);
    };

    return (
        <Space
            className={cx(withSpace ? classes.userTitleSpace : classes.unSpaced)}
            direction="vertical"
            align="center"
        >
            {withSpace && <Title level={3}>Основная информация</Title>}
            {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className={classes.avatarIcon} />
            ) : (
                uploadButton
            )}
            <Dropzone accept={acceptedFiles} onDrop={uploadAvatarFile} maxSize={20000000000}>
                {({ getRootProps, getInputProps }) => {
                    return (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Button className={classes.uploadBtn} type="text">
                                Добавить
                            </Button>
                            {!withSpace && (
                                <Button
                                    onClick={deleteAvatar}
                                    className={classes.deleteBtn}
                                    type="text"
                                >
                                    Удалить
                                </Button>
                            )}
                        </div>
                    );
                }}
            </Dropzone>
            {withSpace && (
                <Button onClick={deleteAvatar} className={classes.deleteBtn} type="text">
                    Удалить
                </Button>
            )}
        </Space>
    );
};
export default memo(AvatarDropZone);
