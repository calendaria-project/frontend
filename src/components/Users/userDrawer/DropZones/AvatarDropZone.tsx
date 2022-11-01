import { FC, memo, useEffect } from "react";
import { Button, Space, Typography, FormInstance } from "antd";
import Dropzone from "react-dropzone";
import { getBase64 } from "../utils/getBase64";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { postFormDataHeader } from "functions/common";
import { useContext, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { AuthContext } from "context/AuthContextProvider";
import { acceptedFiles } from "./acceptedFiles";

const { Title } = Typography;

const AvatarDropZone: FC<{ form: FormInstance; userPhoto?: string | null }> = ({
    form,
    userPhoto
}) => {
    const authContext = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userPhoto) {
            setAvatarUrl(userPhoto);
        }
    }, [userPhoto]);

    const uploadButton = (
        <div className="avatarWrap">
            {loading ? <LoadingOutlined /> : <PlusOutlined color="#fff" />}
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

    const deleteAvatar = () => {
        setAvatarUrl(null);
        form.setFieldValue("profilePhotoId", null);
    };

    return (
        <Space className="userTitleSpace" direction="vertical" align="center">
            <Title level={3}>Основная информация</Title>
            {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
                uploadButton
            )}
            <Dropzone accept={acceptedFiles} onDrop={uploadAvatarFile} maxSize={20000000000}>
                {({ getRootProps, getInputProps }) => {
                    return (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Button color="green" className="uploadBtn" type="text">
                                Добавить
                            </Button>
                        </div>
                    );
                }}
            </Dropzone>
            <Button onClick={deleteAvatar} className="deleteBtn" color="red" type="text">
                Удалить
            </Button>
        </Space>
    );
};
export default memo(AvatarDropZone);
