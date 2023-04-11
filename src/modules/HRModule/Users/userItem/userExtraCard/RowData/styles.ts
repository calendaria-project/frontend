import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";

export default createUseStyles({
    rowWrapper: {
        width: "100%",
        rowGap: "6px"
    },
    endedColWrapper: {
        display: "flex",
        flex: "1 1 auto",
        justifyContent: "end"
    },
    icon: {
        position: "absolute",
        right: "6px",
        top: "4px"
    },
    editIcon: {
        position: "absolute",
        right: "30px",
        top: "4px"
    },
    downloadIcon: {
        position: "absolute",
        right: "6px",
        top: "5px"
    },
    extraInfo: {
        color: ({ theme }: { theme: ITheme } = {} as any) => theme?.color?.extraText
    },
    additionalInfo: {
        color: (
            {
                theme,
                additionalInfoExtraColor
            }: {
                theme: ITheme;
                additionalInfoExtraColor: boolean | undefined;
            } = {} as any
        ) => (additionalInfoExtraColor ? theme?.color?.extraText : theme?.color?.mainText)
    }
});
