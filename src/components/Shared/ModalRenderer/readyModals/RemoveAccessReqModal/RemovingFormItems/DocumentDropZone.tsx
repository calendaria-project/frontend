import React, { FC, memo } from "react";
import { Button, Space, FormInstance } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Dropzone from "react-dropzone";
import { actionMethodResultSync } from "functions/actionMethodResult";
import { postFormDataHeader } from "functions/common";
import { useContext, useState } from "react";
import { AuthContext } from "context/AuthContextProvider";
import { useTheme } from "react-jss";
import { ITheme } from "styles/theme/interface";
import cx from "classnames";
import useStyles from "./styles";
import Spinner from "../../../../../../ui/Spinner";

const DocumentDropZone: FC<{
    form: FormInstance;
    name: string;
}> = ({ form, name }) => {
    const authContext = useContext(AuthContext);

    const theme = useTheme<ITheme>();
    // @ts-ignore
    const classes = useStyles(theme);

    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const uploadDocumentFile = (acceptedFiles: File[]) => {
        const fData = new FormData();
        fData.append("file", acceptedFiles[0]);
        setFileName(null);
        setLoading(true);
        actionMethodResultSync(
            "FILE",
            "file/upload",
            "post",
            postFormDataHeader(authContext.token),
            fData
        )
            .then((res) => {
                setLoading(false);
                setFileName(acceptedFiles[0].name);
                form.setFieldValue(name, res.id);
            })
            .catch(() => {
                setLoading(false);
                form.setFieldValue(name, null);
            });
    };

    return (
        <Space className={classes.space} direction="vertical" align="center">
            <Dropzone
                accept={".doc, .docx, application/pdf"}
                onDrop={uploadDocumentFile}
                maxSize={20000000000}
            >
                {({ getRootProps, getInputProps }) => {
                    return (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Button
                                className={cx(
                                    fileName ? classes.emptyBtn : classes.withFileBtn,
                                    classes.uploadBtn
                                )}
                                type="text"
                            >
                                {!loading ? (
                                    fileName ?? (
                                        <div className={classes.uploadBtnEmptyContainer}>
                                            <span>Загрузить обходной лист</span>
                                            <DownloadOutlined />
                                        </div>
                                    )
                                ) : (
                                    <div className={classes.uploadBtnEmptyContainer}>
                                        <Spinner size={22} />
                                    </div>
                                )}
                            </Button>
                        </div>
                    );
                }}
            </Dropzone>
        </Space>
    );
};
export default memo(DocumentDropZone);
