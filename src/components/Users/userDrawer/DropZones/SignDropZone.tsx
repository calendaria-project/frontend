import { FC, memo, useEffect } from "react";
import { Button, FormInstance, Form, Input } from "antd";
import Dropzone from "react-dropzone";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { postFormDataHeader } from "functions/common";
import { useContext, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { acceptedFiles } from "./acceptedFiles";

const AvatarDropZone: FC<{ form: FormInstance; userSign?: string | null }> = ({
    form,
    userSign
}) => {
    const authContext = useContext(AuthContext);
    const [signFileName, setSignFileName] = useState<string | null>(null);

    useEffect(() => {
        if (userSign) {
            setSignFileName(userSign);
        }
    }, [userSign]);

    const uploadSignFile = (acceptedFiles: File[]) => {
        const fData = new FormData();
        fData.append("file", acceptedFiles[0]);
        actionMethodResultSync(
            "FILE",
            "file/upload",
            "post",
            postFormDataHeader(authContext.token),
            fData
        ).then((res) => {
            form.setFieldValue("signFileId", res.id);
            setSignFileName(acceptedFiles[0].name);
        });
    };

    const deleteSignFile = () => {
        setSignFileName(null);
        form.setFieldValue("signFileId", null);
    };

    return (
        <Form.Item
            // noStyle
            className="uploadItem"
            label="Подпись"
            shouldUpdate={() => signFileName !== null}
        >
            <Input
                className={"sign-upload-input"}
                readOnly
                value={signFileName ? signFileName : undefined}
            />
            {!signFileName ? (
                <Dropzone accept={acceptedFiles} onDrop={uploadSignFile} maxSize={20000000000}>
                    {({ getRootProps, getInputProps }) => {
                        return (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Button className="uploadBtn" type="text">
                                    Загрузить
                                </Button>
                            </div>
                        );
                    }}
                </Dropzone>
            ) : (
                <Button className="deleteBtn" onClick={deleteSignFile} type="text">
                    Удалить
                </Button>
            )}
        </Form.Item>
    );
};
export default memo(AvatarDropZone);
